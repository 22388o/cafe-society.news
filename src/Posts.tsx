
import { createEffect, For} from 'solid-js'
import { fetchPosts, parsePosts } from './utils'

const Posts = (props) => {

  createEffect(() => {
    const feedsForCategory = props.feeds
      .filter((feed) => !props.category || feed.categories.indexOf(props.category) !== -1)
      .map((feed) => {
        return {...feed}
      })
    fetchPosts(feedsForCategory)
    .then(fetchedPosts => parsePosts(fetchedPosts))
    .then((parsedPosts) => {
      if (parsedPosts.flat().length == 0) {
        return
      }
      props.setPosts(parsedPosts.flat())
    })
  })

  return (
    <div>
        <div>{props.category ? props.category : 'posts'}</div>
        <For each={props.posts()} fallback={<div>Loading...</div>}>
          {(post) => <div><a target="_blank" rel="noreferrer noopener" href={post.postId}>{post.postTitle}</a></div>}
        </For>
    </div>
  )
}
export default Posts;