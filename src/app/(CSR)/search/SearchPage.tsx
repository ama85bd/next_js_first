'use client';

import { IUnsplashImage } from '@/models/unsplashImage';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import styles from './SearchPage.module.css';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<IUnsplashImage[] | null>(
    null
  );
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [searchResultsIsError, setSearchResultsIsError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('query')?.toString().trim();
    if (query) {
      try {
        setSearchResults(null);
        setSearchResultsIsError(false);
        setSearchResultsLoading(true);
        const response = await fetch('/api/search?query=' + query);
        const images: IUnsplashImage[] = await response.json();
        setSearchResults(images);
      } catch (error) {
        console.error(error);
        setSearchResultsIsError(true);
      } finally {
        setSearchResultsLoading(false);
      }
    }
  }

  return (
    <div>
      <Alert>
        This page fetches data <strong>client-side</strong>. In order to not
        leak API credentials, the request is sent to a NextJS{' '}
        <strong>route handler</strong> that runs on the server. This route
        handler then fetches the data from the Unsplash API and returns it to
        the client.
      </Alert>

      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='search-input'>
          <Form.Label>Search query</Form.Label>
          <Form.Control name='query' placeholder='E.g. cats, dogs, ...' />
        </Form.Group>
        <Button type='submit' className='mb-3' disabled={searchResultsLoading}>
          Search
        </Button>
      </Form>
      <div className='d-flex flex-column align-items-center'>
        {searchResultsLoading && <Spinner animation='border' />}
        {searchResultsIsError && <p>Something went wrong. Please try agian.</p>}
        {searchResults?.length === 0 && (
          <p>Nothing found. Try a different query.</p>
        )}
      </div>
      {searchResults && (
        <>
          {searchResults.map((image) => (
            <Image
              src={image.urls.raw}
              width={250}
              height={250}
              alt={image.description}
              key={image.urls.raw}
              className={styles.image}
            />
          ))}
        </>
      )}
    </div>
  );
}
