import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
import React from 'react';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock useAuth
const mockUseAuth = vi.fn();
vi.mock('../context/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
    AuthProvider: ({ children }: any) => <div>{children}</div>
}));

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset env var to default mock value
        vi.stubEnv('VITE_ADMIN_EMAIL', 'admin@example.com');
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('shows loading when loading is true', () => {
        mockUseAuth.mockReturnValue({ loading: true, user: null });
        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );
        expect(screen.getByText('Loading...')).toBeDefined();
    });

    it('redirects to login when user is not authenticated', () => {
        mockUseAuth.mockReturnValue({ loading: false, user: null });
        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('redirects to home when user is authenticated but email does not match VITE_ADMIN_EMAIL', () => {
        mockUseAuth.mockReturnValue({
            loading: false,
            user: { email: 'user@example.com' }
        });
        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );
        expect(mockNavigate).toHaveBeenCalledWith('/');
        expect(screen.queryByText('Protected Content')).toBeNull();
    });

    it('redirects to home and logs error when VITE_ADMIN_EMAIL is missing', () => {
        // Stub console.error to avoid noise
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.stubEnv('VITE_ADMIN_EMAIL', '');

        mockUseAuth.mockReturnValue({
            loading: false,
            user: { email: 'admin@example.com' }
        });

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/');
        expect(screen.queryByText('Protected Content')).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('VITE_ADMIN_EMAIL is not set'));

        consoleSpy.mockRestore();
    });

    it('renders children when user is authenticated and email matches', () => {
        mockUseAuth.mockReturnValue({
            loading: false,
            user: { email: 'admin@example.com' }
        });
        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );
        expect(screen.getByText('Protected Content')).toBeDefined();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
