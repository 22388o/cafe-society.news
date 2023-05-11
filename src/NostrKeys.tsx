import {
  For
} from 'solid-js';

import {
  createFormGroup,
  createFormControl,
} from "solid-forms";
import TextInput from './TextInput'
import {
  // eslint-disable-next-line no-redeclare
  Text,
  IconButton,
  Flex,
  Box,
  VStack,
  Button,
  Container,
  Spacer,
  Grid
} from '@hope-ui/core'

import {
  VsAdd,
  VsRemove
} from 'solid-icons/vs'
import { CgErase } from 'solid-icons/cg'
import {
  generatePrivateKey,
  getPublicKey
} from 'nostr-tools'
import { NostrKey } from './db-fixture'

const NostrKeys = (props: {
  nostrKeys: NostrKey[],
  // eslint-disable-next-line no-unused-vars
  putNostrKey: (newKey: NostrKey) => void,
  // eslint-disable-next-line no-unused-vars
  removeNostrKey: (newKey: NostrKey) => void
}) => {


  const group = createFormGroup({
    publicKey: createFormControl(""),
    secretKey: createFormControl(""),
    label: createFormControl(""),
    lightning: createFormControl("")
  });

  const onSubmit = async (event) => {
    event.preventDefault()
    if (group.isSubmitted) {
      console.log('already submitted')
      return;
    }
    [Object.fromEntries(
      Object.entries(Object.assign({
        publicKey:'',
        secretKey:'',
        label:'',
        lightning:''
      }, group.value))
      .filter(([, value]) => `${value}` !== '')
    )]
    .map((newKey) => {
      if (`${newKey.publicKey}${newKey.secretKey}` == 'undefinedundefined') {
        const secretKey = generatePrivateKey()
        newKey.secretKey = secretKey
      }
      return newKey
    })
    .map((newKey) => {
      if (`${newKey.publicKey}` == 'undefined') {
          newKey.publicKey = getPublicKey(newKey.secretKey)
      }
      return newKey
    })
    .filter((newKey) => `${newKey.publicKey}` != 'undefined')
    .forEach(newKey => {
      const newNostrKey: NostrKey = {...{publicKey: '', ...newKey}}
      props.putNostrKey(newNostrKey)
    })
    group.setValue({
      publicKey:'',
      secretKey:'',
      label:'',
      lightning:''
    })
  };

  const handleKeyClick = (publicKey: string) => {
    const valuesForSelectedKey = props.nostrKeys
      .find(nostrKeyEdit => nostrKeyEdit['publicKey'] === publicKey)
    group.setValue(Object.assign({
        publicKey:'',
        secretKey:'',
        label:'',
        lightning:''
      }, valuesForSelectedKey))
  }

  const handleEraseClick = () => {
    group.setValue({
        publicKey:'',
        secretKey:'',
        label:'',
        lightning:''
      })
  }

  return (
  <VStack >
      <form onSubmit={onSubmit}>
        <label for="publicKey">Public Key</label>
        <TextInput name="publicKey" control={group.controls.publicKey} />
        <label for="secretKey">Secret Key</label>
        <TextInput name="secretKey" control={group.controls.secretKey} />
        <Text as="div" color='orange' fontSize="small">(Not secure - do not paste sensitive keys)</Text>
        <label for="label">Label</label>
        <TextInput name="label" control={group.controls.label} />
        <label for="lightning">Lightning</label>
        <TextInput name="lightning" control={group.controls.lightning} />
        <Flex flexDirection='row'>
          <IconButton aria-label="add key"class="btn btn-primary ms-3 w-auto" type="submit" variant="plain">
            <VsAdd />
          </IconButton>
          <IconButton aria-label="erase"class="btn btn-primary ms-3 w-auto" onClick={() => handleEraseClick()} variant="plain">
            <CgErase />
          </IconButton>
        </Flex>
      </form>

      <Container>
        <h4 class="text-muted">Keys</h4>
        <For each={props.nostrKeys}>
          {(nostrKey) => (
            <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={4}>
              <Box>
                <Button onClick={() => handleKeyClick(nostrKey.publicKey)}>
                  {nostrKey.label || nostrKey.publicKey && `${nostrKey.publicKey?.substring(0,5)}...${nostrKey.publicKey?.substring(nostrKey.publicKey?.length - 5, nostrKey.publicKey?.length)}` || ''}
                </Button>
              </Box>
              <Box>
                <IconButton aria-label="remove key" variant="plain">
                  <VsRemove onClick={() => props.removeNostrKey(nostrKey)} />
                </IconButton>
              </Box>
              <Spacer />
            </Grid>
          )}
        </For>
      </Container>
    </VStack>
  )
}
export default NostrKeys;