import React from 'react';
import { Card } from './Card';
import { Text } from './Text';
import { Button } from './Button';
import { Stack } from './Stack';

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  onReset?: () => void;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(): void {}

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card variant="outlined">
          <Stack gap={12}>
            <Text as="h2" size="lg" style={{ fontWeight: 'bold' }}>
              Ocorreu um erro inesperado
            </Text>
            <Text size="sm" color="#666">
              Tente novamente. Se o problema persistir, entre em contato com o suporte.
            </Text>
            <Button variant="primary" label="Tentar novamente" onClick={this.handleReset} />
          </Stack>
        </Card>
      );
    }

    return this.props.children;
  }
}
