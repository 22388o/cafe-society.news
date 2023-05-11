import { convert } from 'html-to-text';
import parse from 'fsp-xml-parser'

export const cleanTags = (text: string): string => {
  const replacements: [RegExp, string][] = [
    [/&rsquo;/g, "'"],
    [/&nbsp;/g, ' '],
    [/\n/g, ' '],
    [/&amp;(rsquo|lsquo|ldquo|rdquo);/g, '"'],
    [/&lt;/g, '<'],
    [/&gt;/g, '>'],
    [/<[^>]+>/g, ''],
    [/&#8217;/g, "'"],
    [/&#8211;/g, '-'],
    [/&#039;/g, "'"],
    [/&amp;nbsp;/g, ' '],
    [/&#38;/g, '-'],
    [/\s{2,}/g, ' '],
    [/&ldquo;/g, '"']
  ];

  return replacements.reduce((cleanedText, [pattern, replacement]) => {
    return cleanedText.replace(pattern, replacement);
  }, convert(text, { ignoreHref: true, ignoreImage: true }));
};

export const parsePosts = (postsXML) => {
  const parseQueue = []
  postsXML.forEach(postsXML => {
    parseQueue.push(new Promise(resolve => {
      const content = parse(postsXML).root

      const feedTitle =
        content.children?.find(item => item.name === 'title')?.content?.toString() ||
        content.children[0]?.children.find(item => item.name === 'title')?.content?.toString()

      const feedLink =
        content.children?.find(item => item.name === 'link')?.attributes?.href?.toString() ||
        content.children[0]?.children?.find(item => item.name === 'link')?.content?.toString()

      const feedDescription =
        content.children?.find(item => item.name === 'subtitle')?.content?.toString() ||
        content.children[0]?.children?.find(item => item.name === 'description')?.content?.toString()

      const feedPosts = content.children[0].children ?
        // pick posts from RSS Feed
        content.children[0].children.filter(postItem => postItem.name.toString() === 'item')
          .map(postsNode => {
              return {
                postId: postsNode.children.find(postItemAttribute => postItemAttribute.name === 'link').content?.replace(/^<!\[CDATA\[|\]\]>$/g,''),
                postTitle: postsNode.children.find(postItemAttribute => postItemAttribute.name === 'title').content?.replace(/^<!\[CDATA\[|\]\]>$/g,''),
                postSummary: postsNode.children.find(postItemAttribute => postItemAttribute.name === 'description')?.content?.replace(/^<!\[CDATA\[|\]\]>$/g,'')
              }
          })
        :
        // pick posts from ATOM Feed
        content.children.filter(feedPostItem => feedPostItem.name.toString() === 'entry')
          .map(postsNode => {
            return {
              postId: postsNode.children.find(postItemAttribute => postItemAttribute.name === 'link').attributes.href.toString(),
              postTitle: postsNode.children.find(postItemAttribute => postItemAttribute.name === 'title').content?.replace(/^<!\[CDATA\[|\]\]>$/g,''),
              postSummary: postsNode.children.find(postItemAttribute => postItemAttribute.name === 'summary').content?.replace(/^<!\[CDATA\[|\]\]>$/g,'')
            }
          })

      const parsed = feedPosts
      .map((itemEntry) => ({
        feedTitle: feedTitle?.replace(/^<!\[CDATA\[|\]\]>$/g,''),
        feedLink: feedLink,
        feedDescription: feedDescription?.replace(/^<!\[CDATA\[|\]\]>$/g,''),
        ...itemEntry
      }))
      resolve(parsed)
    }))
  })
  return Promise.all(parseQueue)
}

export const fetchPosts = (feeds => {
  const fetchQueue = []
  feeds.forEach(feed => {
      fetchQueue.push(new Promise((resolve) => {
      fetch(`https://localhost:5000/${feed.id}`).then(response => {
        response.text().then(feedText => {
          resolve(feedText)
        })
      })
    }))
  })
  return Promise.all(fetchQueue)
})
