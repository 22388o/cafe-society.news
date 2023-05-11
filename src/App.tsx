import {
  Component,
  createSignal,
  For,
  Suspense
  // ,
  // createResource
} from 'solid-js';
// import {createFetch} from '@solid-primitives/fetch'
// import axios from 'axios';
import {
  Routes,
  Route,
  Link,
  useParams
} from '@solidjs/router';
import { CgMenu } from 'solid-icons/cg';
import { HopeProvider as LegacyHopeProvider } from '@hope-ui/solid'
import {
  HopeProvider,
  Heading,
  Drawer,
  HStack,
  Anchor,
  VStack,
  IconButton,
  Center,
  createTransition,
  Box
} from "@hope-ui/core";
import Contribute from './Contribute';
import Settings from './Settings';
import NostrKeys from './NostrKeys';
import Feeds from './Feeds';
import Categories from './Categories';
import CorsProxies from './CorsProxies';
import Posts from './Posts';
import { DbFixture } from "./db-fixture";

// import { parseFeedContentMulti } from './utils'

import defaultFeeds from './assets/defaultFeeds.json'
import { Feed } from './db-fixture'

import defaultCorsProxies from './assets/defaultCorsProxies.json'
import { CorsProxy } from './db-fixture'

import defaultNostrKeys from './assets/defaultNostrKeys.json'
import { NostrKey } from './db-fixture'

import defaultCategories from './assets/defaultCategories.json'
import { Category } from './db-fixture'

import { createDexieArrayQuery } from "solid-dexie";

const db = new DbFixture();

db.on("populate", () => {
  db.nostrkeys.bulkAdd(defaultNostrKeys as NostrKey[]);
  db.feeds.bulkAdd(defaultFeeds as Feed[]);
  db.corsProxies.bulkAdd(defaultCorsProxies as CorsProxy[]);
  db.categories.bulkAdd(defaultCategories as Category[]);
});

const App: Component = () => {
  const [showError, setShowError] = createSignal(false);
  // const [selectedCategory, setSelectedCategory] = createSignal(null);
  const [currentError, setCurrentError] = createSignal('no error yet');
  const { style } = createTransition(showError, {
    transition: "fade",
    duration: 400,
    easing: "ease"
  });
  const nostrKeys = createDexieArrayQuery(() => db.nostrkeys.toArray());

  const putNostrKey = async (newKey) => {
    await db.nostrkeys.put(newKey)
  }

  const removeNostrKey = async (nostrKeyRemove) => {
    await db.nostrkeys.where('publicKey').equals(nostrKeyRemove.publicKey).delete()
  }

  const feeds = createDexieArrayQuery(() => db.feeds.toArray());

  const checkedFeedsForCategory = createDexieArrayQuery(() => db.feeds
    // .where('categories').equals(`${useParams().category}`)
    .filter(feed => feed.checked === true)
    .toArray());

  const putFeed = async (newFeed) => {
    await db.feeds.put(newFeed).catch(error => {
      setCurrentError(error.message)
      setShowError(true)
    })
  }
  const removeFeed = async (feedRemove) => {
    await db.feeds.where('id').equals(feedRemove.id).delete().catch(error => {
      setCurrentError(error.message)
      setShowError(true)
    })
  }

  const corsProxies = createDexieArrayQuery(() => db.corsProxies.toArray());

  const putCorsProxy = async (newCorsProxy) => {
    await db.corsProxies.put(newCorsProxy).catch(error => {
      setCurrentError(error.message)
      setShowError(true)
    })
  }
  const removeCorsProxy = async (corsProxyToRemove) => {
    await db.corsProxies.where('id').equals(corsProxyToRemove.id).delete().catch(error => {
      setCurrentError(error.message)
      setShowError(true)
    })
  }


  const categories = createDexieArrayQuery(() => db.categories.toArray());

  const putCategory = async (newCategory) => {
    await db.categories.put(newCategory).catch(error => {
      setCurrentError(error.message)
      setShowError(true)
    })
  }
  const removeCategory = async (categoryToRemove) => {
    await db.categories.where('id').equals(categoryToRemove.id).delete().catch(error => {
      setCurrentError(error.message)
      setShowError(true)
    })
  }

  const [isOpen, setIsOpen] = createSignal(false);
  const [posts, setPosts] = createSignal([])
  return (
    <LegacyHopeProvider>
    <HopeProvider>
      <IconButton
        aria-label="Open Drawer"
        onClick={() => setIsOpen(true)}
        variant="plain"
      >
        <CgMenu />
      </IconButton>
      <Drawer
        isOpen={isOpen()}
        onClose={() => setIsOpen(false)}
        placement={'left'}
      >
        <Drawer.Overlay />
        <Drawer.Content p={4}>
          <HStack justifyContent="space-between">
            <Drawer.Heading fontWeight="semibold">
            <Anchor
                as={Link}
                href="/posts"
                onClick={() => {
                  setPosts([])
                  setIsOpen(false)
                }}
              >
                Posts
              </Anchor>
            </Drawer.Heading>
            <Drawer.CloseButton />
          </HStack>
            <For each={categories}>
              {
              (category) => (
                <HStack marginLeft="5" justifyContent="normal">
                <Box />
                  <Drawer.Heading fontWeight="semibold">
                    <Anchor
                        as={Link}
                        href={`/posts/${category.id}`}
                        onClick={() => {
                          setIsOpen(false)
                          setPosts([])
                          // setSelectedCategory(`${category.id}`)
                        }}
                      >
                        {`${category.id}`}
                    </Anchor>
                  </Drawer.Heading>
                  <Box />
                <Box />
                </HStack>
                )
              }
            </For>
          <HStack justifyContent="space-between">
            <Drawer.Heading fontWeight="semibold">
              <Anchor
                as={Link}
                href="/settings"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Anchor>
            </Drawer.Heading>
          </HStack>
          <HStack justifyContent="space-between">
            <Drawer.Heading fontWeight="semibold">
              <Anchor
                as={Link}
                href="/nostr"
                onClick={() => setIsOpen(false)}
              >
                Nostr
              </Anchor>
            </Drawer.Heading>
          </HStack>
          <HStack justifyContent="space-between" mb={4}>
            <Drawer.Heading fontWeight="semibold">
              <Anchor
                as={Link}
                href="/contribute"
                onClick={() => setIsOpen(false)}
              >
                Contribute
              </Anchor>
            </Drawer.Heading>
          </HStack>
          <HStack justifyContent="space-between" mb={4}>
            <Drawer.Heading fontWeight="semibold">
              <Anchor
                as={Link}
                href="/feeds"
                onClick={() => setIsOpen(false)}
              >
                Feeds
              </Anchor>
            </Drawer.Heading>
          </HStack>
          <HStack justifyContent="space-between" mb={4}>
            <Drawer.Heading fontWeight="semibold">
              <Anchor
                as={Link}
                href="/cors"
                onClick={() => setIsOpen(false)}
              >
                Cors Proxies
              </Anchor>
            </Drawer.Heading>
          </HStack>
          <HStack justifyContent="space-between" mb={4}>
            <Drawer.Heading fontWeight="semibold">
              <Anchor
                as={Link}
                href="/categories"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Anchor>
            </Drawer.Heading>
          </HStack>
        </Drawer.Content>
      </Drawer>
      <Routes>
        <Route element={<Center><Contribute /></Center>} path='/contribute' />
        <Route element={<Center><Settings /></Center>} path='/settings' />
        <Route element={
          <Center>
            <Feeds
              feeds={feeds}
              putFeed={putFeed}
              removeFeed={removeFeed}
             />
          </Center>
        } path='/feeds'
        />
        <Route element={
          <Center>
            <CorsProxies
              corsProxies={corsProxies}
              putCorsProxy={putCorsProxy}
              removeCorsProxy={removeCorsProxy}
             />
          </Center>
        } path='/cors'
        />
        <Route element={
          <div>
            <VStack>
              <Heading level="1">Nostr Keys</Heading>
              <NostrKeys
                nostrKeys={nostrKeys}
                putNostrKey={putNostrKey}
                removeNostrKey={removeNostrKey}
              />
            </VStack>
          </div>
        } path='/nostr'
        />
        <Route element={
          <div>
            <VStack>
              <Heading level="1">Categories</Heading>
              <Categories
                categories={categories}
                putCategory={putCategory}
                removeCategory={removeCategory}
              />
            </VStack>
          </div>
        } path='/categories'
        />
        <Route
          element={
            <Suspense>
              <Posts
                category={useParams().category}
                feeds={checkedFeedsForCategory}
                posts={posts}
                setPosts={setPosts}
              >
                <Posts />
              </Posts>
            </Suspense>
          }
          path={[
            '/',
            '/posts',
            '/posts/:category'
          ]}
        />
      </Routes>
      <Box onClick={() => setShowError(() => false)} p={4} color="white" mt="4" bg="Red" rounded="md" shadow="md" style={style()}>
        {currentError()}
      </Box>
    </HopeProvider>
    </LegacyHopeProvider>
  )
}
export default App;
