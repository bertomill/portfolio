'use client'

import {
  VStack,
  Heading,
  Box,
  Text,
  Link,
  Tag,
  HStack,
  useColorModeValue,
  Skeleton,
  Container,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import type { BlogPost } from '@/lib/getBlogPosts'

const MotionBox = motion(Box)
const MotionLink = motion(Link)

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const hoverBg = useColorModeValue('rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.05)')
  const dateFontColor = useColorModeValue('gray.400', 'gray.400')
  const tagBg = useColorModeValue('whiteAlpha.200', 'whiteAlpha.200')

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'MMMM d, yyyy')
    } catch (error) {
      console.error('Error formatting date:', error)
      return dateString
    }
  }

  return (
    <Container maxW="container.md" px={{ base: 4, md: 8 }}>
      <VStack 
        spacing={8} 
        alignItems="stretch" 
        pt={{ base: 16, md: 40 }} 
        pb={{ base: 16, md: 20 }}
      >
        <Heading 
          as="h1" 
          size={{ base: "xl", md: "2xl" }}
          mb={{ base: 6, md: 8 }} 
          textAlign="center"
        >
          Blog
        </Heading>

        <VStack spacing={{ base: 3, md: 4 }} align="stretch">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <Box 
                key={i} 
                p={{ base: 4, md: 6 }} 
                borderRadius="xl" 
                bg={hoverBg}
              >
                <VStack align="stretch" spacing={3}>
                  <Skeleton height="20px" width="100px" />
                  <Skeleton height="24px" width="100%" />
                  <Skeleton height="20px" width="200px" />
                </VStack>
              </Box>
            ))
          ) : (
            posts.map((post, index) => (
              <MotionBox
                key={post.guid || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <MotionLink
                  href={post.link}
                  isExternal
                  textDecoration="none"
                  display="block"
                  p={{ base: 4, md: 6 }}
                  borderRadius="xl"
                  position="relative"
                  _hover={{
                    bg: hoverBg,
                    transform: 'translateY(-2px)',
                  }}
                  transition="all 0.2s"
                  role="group"
                >
                  <Box
                    position="absolute"
                    inset={0}
                    borderRadius="xl"
                    opacity={0}
                    bg="linear-gradient(45deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)"
                    transition="opacity 0.2s"
                    _groupHover={{ opacity: 1 }}
                  />

                  <VStack align="stretch" spacing={{ base: 2, md: 3 }}>
                    <Text 
                      fontSize={{ base: "xs", md: "sm" }}
                      color={dateFontColor}
                      fontFamily="mono"
                    >
                      {formatDate(post.pubDate)}
                    </Text>
                    
                    <Text
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="semibold"
                      color="white"
                      _groupHover={{ 
                        bgGradient: "linear(to-r, gray.100, white)",
                        bgClip: "text"
                      }}
                      transition="all 0.2s"
                    >
                      {post.title}
                    </Text>

                    {post.categories?.length > 0 && (
                      <HStack 
                        spacing={2} 
                        mt={2}
                        flexWrap="wrap"
                        gap={2}
                      >
                        {post.categories.map((category) => (
                          <Tag
                            key={category}
                            size={{ base: "sm", md: "md" }}
                            bg={tagBg}
                            color="white"
                          >
                            {category}
                          </Tag>
                        ))}
                      </HStack>
                    )}
                  </VStack>
                </MotionLink>
              </MotionBox>
            ))
          )}
        </VStack>
      </VStack>
    </Container>
  )
} 