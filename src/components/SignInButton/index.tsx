import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, useSession, signOut } from 'next-auth/react';

import styles from './styles.module.scss';

export function SignInButton() {
  const { data: session, status } = useSession();

  return status === 'authenticated' ? 
  <button
    className={styles.signInButton}
    type="button"
  >
    <FaGithub color="#04d361" />
    {session.user.name}
    <FiX color="#737380" className={styles.closeIcon} onClick={() => signOut()}/>
  </button>
  : (
    <button
      className={styles.signInButton}
      type="button"
      onClick={() => signIn('github')}
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
}