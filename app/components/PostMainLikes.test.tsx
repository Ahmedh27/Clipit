import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PostMainLikes from './PostMainLikes' // Adjust the import path as needed.

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}));

// Mock user context
jest.mock('../context/user', () => ({
  useUser: () => ({
    user: { id: 'mockUserId', name: 'Mock User' }
  })
}));

// Mock Zustand stores
jest.mock('../stores/general', () => ({
  useGeneralStore: () => ({ setIsLoginOpen: jest.fn() })
}));

// Mock hooks
jest.mock('../hooks/useGetCommentsByPostId', () => jest.fn(() => Promise.resolve([])));
jest.mock('../hooks/useGetLikesByPostId', () => jest.fn(() => Promise.resolve([])));
jest.mock('../hooks/useIsLiked', () => jest.fn(() => false));
jest.mock('../hooks/useCreateLike', () => jest.fn(() => Promise.resolve()));
jest.mock('../hooks/useDeleteLike', () => jest.fn(() => Promise.resolve()));

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Provide all required fields as per PostWithProfile type
const mockPost = {
  id: 'post123',
  user_id: 'user2', 
  profile: {
    user_id: 'user2',
    name: 'Test User',
    image: 'test-image.jpg'
  },
  created_at: '2024-12-17T12:00:00Z',
  text: 'Test post text',
  video_url: 'test-video-url.mp4'
};

test('renders PostMainLikes component and shows buttons', () => {
  render(<PostMainLikes post={mockPost} />);

  // Check if the like button is present
  const likeButtons = screen.getAllByRole('button');
  expect(likeButtons.length).toBeGreaterThan(0);

  // Check for "Share" text
  const shareText = screen.getByText('Share');
  expect(shareText).toBeInTheDocument();
});
