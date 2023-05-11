import { Component } from 'solid-js'
import {
  Heading,
  VStack
} from '@hope-ui/core'
import ToggleColorMode from './ToggleColorMode'

const Settings: Component<{}> = () => {
  return(
    <VStack spacing="$3">
      <Heading level="1">Settings</Heading>
      <ToggleColorMode />
    </VStack>
  )
};

export default Settings





