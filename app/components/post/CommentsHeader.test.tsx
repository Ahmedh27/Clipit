// CommentsHeader.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CommentsHeader from './CommentsHeader' // Adjust the import path as needed.

// Mock hooks and dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}));

jest.mock('@/app/context/user', () => ({
  useUser: () => ({ user: { id: 'user1', name: 'Test User' } })
}));

jest.mock('@/app/stores/like', () => ({
  useLikeStore: () => ({ likesByPost: [], setLikesByPost: jest.fn() })
}));

jest.mock('@/app/stores/comment', () => ({
  useCommentStore: () => ({ commentsByPost: [], setCommentsByPost: jest.fn() })
}));

jest.mock('@/app/stores/general', () => ({
  useGeneralStore: () => ({ setIsLoginOpen: jest.fn() })
}));

jest.mock('@/app/hooks/useCreateBucketUrl', () => jest.fn((url: string) => `http://test.com/${url}`));
jest.mock('@/app/hooks/useIsLiked', () => jest.fn(() => false));
jest.mock('@/app/hooks/useCreateLike', () => jest.fn());
jest.mock('@/app/hooks/useDeleteLike', () => jest.fn());
jest.mock('@/app/hooks/useDeletePostById', () => jest.fn());

const mockPost = {
  id: 'post123',
  user_id: 'user2',
  profile: {
    user_id: 'user2', // Ensure this matches PostWithProfile requirements
    name: 'Another User',
    image: 'profile.jpg'
  },
  created_at: '2024-12-17T12:00:00Z',
  text: 'This is a test post',
  video_url: 'video.mp4'
};

const mockParams = {
  userId: 'user2',
  postId: 'post123'
};

test('renders the CommentsHeader component with provided post data', () => {
  render(<CommentsHeader post={mockPost} params={mockParams} />)

  // Check if the user name appears
  expect(screen.getByText('Another User')).toBeInTheDocument()
});
