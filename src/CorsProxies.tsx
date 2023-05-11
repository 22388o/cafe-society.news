import {
  For
} from 'solid-js';

import {
  Switch
} from "@hope-ui/solid"

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

import { CorsProxy } from './db-fixture'
const CorsProxies = (props: {
  corsProxies: CorsProxy[],
  // eslint-disable-next-line no-unused-vars
  putCorsProxy: (corsProxy: CorsProxy) => void,
  // eslint-disable-next-line no-unused-vars
  removeCorsProxy: (corsProxy: CorsProxy) => void
}) => {

  const { style } = createTransition(true, {
    transition: "skew-down",
    duration: 400,
    easing: "ease",
  });

  const group = createFormGroup({
    id: createFormControl(""),
    checked: createFormControl(true)
  });

  const onSubmit = async (event) => {
    event.preventDefault()
    if (group.isSubmitted) {
      // console.log('already submitted')
      return;
    }
    [Object.fromEntries(
      Object.entries(Object.assign({
        id:'',
        checked:true
      }, group.value))
      .filter(([, value]) => `${value}` !== '')
    )]
    .forEach(newCorsProxy => {
      const newCorsProxyObj: CorsProxy = {
        ...{
          id: '',
          checked: true
        },
        ...newCorsProxy
      }
      props.putCorsProxy(newCorsProxyObj)
    })

    group.setValue({
      id:'',
      checked:true
    })
  };

  const handleKeyClick = (id: string) => {
    const valuesForSelectedFeed = props.corsProxies
      .find(corsProxyEdit => corsProxyEdit['id'] === id)
    group.setValue(Object.assign({
        id:'',
        checked:true
      }, valuesForSelectedFeed))
  }

  const handleToggleChecked = (id: string) => {
    const valuesForSelectedFeed = props.corsProxies
    .find(corsProxyEdit => corsProxyEdit['id'] === id)
    const newValueObj = (Object.assign(
      {
        ...valuesForSelectedFeed
      },
      {checked: !group.value.checked}
    ))

    group.setValue (newValueObj)
    props.putCorsProxy(newValueObj)
  }

  const handleEraseClick = () => {
    group.setValue({
        id:'',
        checked:true
      })
  }

  return (
    <div>
    <div>cors proxies</div>
     <VStack alignItems="stretch" spacing="$4">
<div>
  <form onSubmit={onSubmit}>
    <label for="id">URL</label>
    <TextInput name="id" control={group.controls.id} />
    <div />
    <Switch
      checked={group.value.checked}
      name="checked"
      onChange={() => {
        handleToggleChecked(group.value.id)
      }}
    />
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
  <h4 class="text-muted">CorsProxies</h4>
  <For each={props.corsProxies}>
    {(corsProxy) => (
      <Flex flexDirection='row' gap="$10">
        <Box>
          <Button
            variant='plain'
            // eslint-disable-next-line solid/reactivity
            onClick={() => handleKeyClick(corsProxy.id)}
          >
            {corsProxy.id}
          </Button>
        </Box>
        <Spacer />
        <Box>
          <IconButton aria-label="remove key" variant="plain">
            <VsRemove onClick={() => { props.removeCorsProxy(corsProxy)}} />
          </IconButton>
        </Box>
      </Flex>
    )}
  </For>
</Box>
</VStack>
</div>
  )
}
export default CorsProxies;
