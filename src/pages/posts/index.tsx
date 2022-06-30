import Head from 'next/head';
import * as prismic from '@prismicio/client';
import { GetStaticProps } from 'next/types';
import { RichText } from 'prismic-dom';

import { client } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <a href="#" key={post.slug}>
            <time>{post.updatedAt}</time>
            <strong>{post.title}</strong>
            <p>{post.excerpt}</p>
          </a>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await client.get({
    predicates: [
      prismic.predicate.at('document.type', 'publication'),
    ],
    fetch: ['publication.Title', 'publication.Content'],
    pageSize: 100,
  });

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: post.data.Title,
      excerpt: post.data.Content?.find(text => text.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    };
  });


  return {
    props: {
      posts,
    }
  };
};