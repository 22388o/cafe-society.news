import type { Component } from 'solid-js';
import {
  Heading,
  VStack
} from '@hope-ui/core'

const Contribute: Component = () => {
  return (
    <VStack spacing="$3">
    <Heading level="1">Contribute</Heading>
    <a href="https://getalby.com/p/cafe">cafe@getalby.com</a>
  </VStack>
  )
}
export default Contribute;