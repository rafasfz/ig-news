import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps, GetStaticProps } from "next/types";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { client } from "../../../services/prismic";

import styles from '../post.module.scss';

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
      return;
    }
  }, [session, router, post.slug]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            dangerouslySetInnerHTML={{__html: post.content}}
            className={`${styles.postContent} ${styles.previewContent}`}
          />

        <div className={styles.continueReading}>
            Wanna continue reading?
              <Link href="/">
                <a>Subscribe now 🤗</a>
              </Link>
          </div>
        </article>
      </main>
    </>
  );
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const response = await client.getByUID('publication', String(slug), {});

  const post = {
    slug,
    title: response.data.Title,
    content: RichText.asHtml(response.data.Content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  };

  return {
    props: {
      post
    },
    revalidate: 60 * 30, 
  };
};