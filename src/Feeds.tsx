import {
  For
} from 'solid-js';

import {
  createFormGroup,
  createFormControl,
} from "solid-forms";
import TextInput from './TextInput'
import {
  IconButton,
  Flex,
  Button,
  Box,
  Spacer,
  VStack,
  createTransition
} from '@hope-ui/core'

import {
  VsAdd,
  VsRemove
} from 'solid-icons/vs'
import { CgErase } from 'solid-icons/cg'

import { Feed } from './db-fixture'
const Feeds = (props: {
  feeds: Feed[],
  // eslint-disable-next-line no-unused-vars
  putFeed: (feed: Feed) => void,
  // eslint-disable-next-line no-unused-vars
  removeFeed: (feed: Feed) => void
}) => {

  const { style } = createTransition(true, {
    transition: "fade",
    duration: 400,
    easing: "ease",
  });

  const group = createFormGroup({
    id: createFormControl(""),
    checked: createFormControl(true),
    categories: createFormControl([])
  });

  const onSubmit = async (event) => {
    event.preventDefault()
    if (group.isSubmitted) {
      console.log('already submitted')
      return;
    }
    [Object.fromEntries(
      Object.entries(Object.assign({
        id:'',
        checked:true,
        categories:['']
      }, group.value))
      .filter(([, value]) => `${value}` !== '')
    )]
    .forEach(newFeed => {
      const newFeedObj: Feed = {
        ...{
          id: '',
          checked: true,
          categories: []
        },
        ...newFeed
      }
      props.putFeed(newFeedObj)
    })

    group.setValue({
      id:'',
      checked:true,
      categories:['']
    })
  };

  const handleKeyClick = (id: string) => {
    const valuesForSelectedFeed = props.feeds
      .find(feedEdit => feedEdit['id'] === id)
    group.setValue(Object.assign({
        id:'',
        checked:true,
        categories: ['']
      }, valuesForSelectedFeed))
  }

  // const handleToggleChecked = (id: string) => {
  //   const valuesForSelectedFeed = props.feeds
  //   .find(corsProxyEdit => corsProxyEdit['id'] === id)
  //   const newValueObj = (Object.assign(
  //     {
  //       ...valuesForSelectedFeed
  //     },
  //     {checked: !group.value.checked}
  //   ))

  //   group.setValue (newValueObj)
  //   props.putFeed(newValueObj)
  // }

  const handleEraseClick = () => {
    group.setValue({
        id:'',
        checked:true,
        categories:['']
      })
  }

  return (
    <VStack alignItems="stretch" spacing="$4">
      <div>
        <form onSubmit={onSubmit}>
          <label for="id">URL</label>
          <TextInput name="id" control={group.controls.id} />
          {/* <label for="label">categories</label> */}
          {/* <TextInput name="categories" control={group.controls.categories} /> */}
          <Flex flexDirection='row'>
            <IconButton aria-label="add key"class="btn btn-primary ms-3 w-auto" type="submit" variant="plain">
              <VsAdd />
            </IconButton>
            <IconButton aria-label="erase"class="btn btn-primary ms-3 w-auto" onClick={() => handleEraseClick()} variant="plain">
              <CgErase />
            </IconButton>
          </Flex>
        </form>
      </div>
      <Box style={style()}>
        <h4 class="text-muted">Feeds</h4>
        <For each={props.feeds}>
          {(feed) => (
            <Flex flexDirection='row' gap="$10">
              <Box>
                <Button
                  variant='plain'
                  // eslint-disable-next-line solid/reactivity
                  onClick={() => handleKeyClick(feed.id)}
                >
                  {feed.id}
                </Button>
              </Box>
              <Spacer />
              <Box>
                <IconButton aria-label="remove key" variant="plain">
                  <VsRemove onClick={() => { props.removeFeed(feed)}} />
                </IconButton>
              </Box>
            </Flex>
          )}
        </For>
      </Box>
    </VStack>
  )
}
export default Feeds;