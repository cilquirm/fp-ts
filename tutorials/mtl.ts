import { liftA2 } from '../src/Apply'
import { identity } from '../src/function'
import { HKT, Kind, Kind3, URIS, URIS3 } from '../src/HKT'
import { IO, io, URI as IOURI } from '../src/IO'
import { Monad, Monad1, Monad3C } from '../src/Monad'
import * as RTE from '../src/ReaderTaskEither'
import { delay2v, task, URI as TaskURI } from '../src/Task'
import * as TE from '../src/TaskEither'

// Adapted from https://tech.iheart.com/why-fp-its-the-composition-f585d17b01d3

//
// type classes
//

interface MonadUser<M> {
  validateUser: (token: string) => HKT<M, string>
  facebookToken: (uid: string) => HKT<M, string>
}

interface MonadFB<M> {
  findPost: (url: string) => HKT<M, string>
  sendLike: (fbToken: string) => (post: string) => HKT<M, boolean>
}

interface MonadApp<M> extends MonadUser<M>, MonadFB<M>, Monad<M> {}

//
// program
//

function likePost<M extends URIS3, U, L>(
  M: MonadApp3C<M, U, L>
): (token: string) => (url: string) => Kind3<M, U, L, boolean>
function likePost<M extends URIS>(M: MonadApp1<M>): (token: string) => (url: string) => Kind<M, boolean>
function likePost<M>(M: MonadApp<M>): (token: string) => (url: string) => HKT<M, boolean> {
  return token => url => {
    const mToken = M.chain(M.validateUser(token), uid => M.facebookToken(uid))
    const mPost = M.findPost(url)
    // tslint:disable-next-line: deprecation
    const mmResult = liftA2(M)(M.sendLike)(mToken)(mPost)
    return M.chain(mmResult, identity)
  }
}

//
// instances
//

interface MonadUser1<M extends URIS> {
  validateUser: (token: string) => Kind<M, string>
  facebookToken: (uid: string) => Kind<M, string>
}

interface MonadFB1<M extends URIS> {
  findPost: (url: string) => Kind<M, string>
  sendLike: (fbToken: string) => (post: string) => Kind<M, boolean>
}

interface MonadApp1<M extends URIS> extends MonadUser1<M>, MonadFB1<M>, Monad1<M> {}

// IO

const monadUserIO: MonadUser1<IOURI> = {
  validateUser: token => io.of(`string(${token})`),
  facebookToken: uid => io.of(`FBToken(${uid})`)
}

const monadFBIO: MonadFB1<IOURI> = {
  findPost: url => io.of(`FBPost(${url})`),
  sendLike: token => (post: string) => {
    return new IO(() => true)
  }
}

const monadAppIO: MonadApp1<IOURI> = {
  ...(io as Monad1<IOURI>),
  ...monadUserIO,
  ...monadFBIO
}

// tslint:disable-next-line:no-console
console.log('IO', likePost(monadAppIO)('session123')('https://me.com/1').run())
// => IO true

// Task

const monadUserTask: MonadUser1<TaskURI> = {
  validateUser: token => delay2v(1000)(task.of(`string(${token})`)),
  facebookToken: uid => delay2v(500)(task.of(`FBToken(${uid})`))
}

const monadFBTask: MonadFB1<TaskURI> = {
  findPost: url => delay2v(2000)(task.of(`FBPost(${url})`)),
  sendLike: token => (post: string) => delay2v(1000)(task.of(true))
}

const monadAppTask: MonadApp1<TaskURI> = {
  ...(task as Monad1<TaskURI>),
  ...monadUserTask,
  ...monadFBTask
}

// tslint:disable-next-line: no-floating-promises
likePost(monadAppTask)('session123')('https://me.com/1')
  .run()
  // tslint:disable-next-line:no-console
  .then(result => console.log('Task', result))
// => Task true

// ReaderTaskEither

interface MonadUser3C<M extends URIS3, U, L> {
  validateUser: (token: string) => Kind3<M, U, L, string>
  facebookToken: (uid: string) => Kind3<M, U, L, string>
}

interface MonadFB3C<M extends URIS3, U, L> {
  findPost: (url: string) => Kind3<M, U, L, string>
  sendLike: (fbToken: string) => (post: string) => Kind3<M, U, L, boolean>
}

interface MonadApp3C<M extends URIS3, U, L> extends MonadUser3C<M, U, L>, MonadFB3C<M, U, L>, Monad3C<M, U, L> {}

type Env = { error: boolean }

const monadUserReaderTaskEither: MonadUser3C<RTE.URI, Env, Error> = {
  validateUser: token =>
    new RTE.ReaderTaskEither(e =>
      e.error ? TE.left2v(new Error('validateUser error')) : TE.rightTask(monadUserTask.validateUser(token))
    ),
  facebookToken: uid => RTE.rightTask(monadUserTask.facebookToken(uid))
}

const monadFBReaderTaskEither: MonadFB3C<RTE.URI, Env, Error> = {
  findPost: url => RTE.rightTask(monadFBTask.findPost(url)),
  sendLike: token => (post: string) => RTE.rightTask(monadFBTask.sendLike(token)(post))
}

const monadAppReaderTaskEither: MonadApp3C<RTE.URI, Env, Error> = {
  ...((RTE.readerTaskEither as any) as Monad3C<RTE.URI, Env, Error>),
  ...monadUserReaderTaskEither,
  ...monadFBReaderTaskEither
}

const ma = likePost(monadAppReaderTaskEither)('session123')('https://me.com/1')

// tslint:disable-next-line: no-floating-promises
ma.run({ error: true })
  // tslint:disable-next-line:no-console
  .then(result => console.log('ReaderTaskEither 2', result))
// => ReaderTaskEither 2 left(Error: validateUser error)

// tslint:disable-next-line: no-floating-promises
ma.run({ error: false })
  // tslint:disable-next-line:no-console
  .then(result => console.log('ReaderTaskEither 1', result))
// => ReaderTaskEither 1 right(true)
