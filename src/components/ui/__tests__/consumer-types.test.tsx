/**
 * Consumer Type Compatibility Test
 *
 * This test file simulates how consumers use our components.
 * TypeScript compilation will catch any type mismatches between:
 * - CVA variant definitions
 * - Component props interfaces
 * - Actual usage patterns
 *
 * If a component has CVA variants but props don't include them,
 * this test will fail to compile - catching the bug BEFORE publish.
 *
 * The PageHeader bug would have been caught here:
 * <PageHeader variant="default" /> would fail TypeScript compilation
 * because variant wasn't in the Props interface.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as React from 'react'

// Import all components as consumers would
import {
  Button,
  Badge,
  Tag,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Switch,
  Input,
  TextField,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  MultiSelect,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  PageHeader,
} from '../../../index'

describe('Consumer Type Compatibility', () => {
  describe('Button', () => {
    it('accepts variant prop with all valid values', () => {
      const { rerender } = render(<Button variant="default">Test</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()

      rerender(<Button variant="primary">Test</Button>)
      rerender(<Button variant="destructive">Test</Button>)
      rerender(<Button variant="outline">Test</Button>)
      rerender(<Button variant="secondary">Test</Button>)
      rerender(<Button variant="ghost">Test</Button>)
      rerender(<Button variant="link">Test</Button>)
      rerender(<Button variant="dashed">Test</Button>)
    })

    it('accepts size prop with all valid values', () => {
      const { rerender } = render(<Button size="default">Test</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()

      rerender(<Button size="sm">Test</Button>)
      rerender(<Button size="lg">Test</Button>)
      rerender(<Button size="icon">Test</Button>)
      rerender(<Button size="icon-sm">Test</Button>)
      rerender(<Button size="icon-lg">Test</Button>)
    })

    it('accepts combined variant and size props', () => {
      render(<Button variant="primary" size="lg">Test</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Badge', () => {
    it('accepts variant prop with all valid values', () => {
      const { rerender } = render(<Badge variant="default">Test</Badge>)
      expect(screen.getByText('Test')).toBeInTheDocument()

      rerender(<Badge variant="active">Test</Badge>)
      rerender(<Badge variant="failed">Test</Badge>)
      rerender(<Badge variant="disabled">Test</Badge>)
      rerender(<Badge variant="primary">Test</Badge>)
      rerender(<Badge variant="secondary">Test</Badge>)
      rerender(<Badge variant="outline">Test</Badge>)
      rerender(<Badge variant="destructive">Test</Badge>)
    })

    it('accepts size prop with all valid values', () => {
      const { rerender } = render(<Badge size="default">Test</Badge>)
      expect(screen.getByText('Test')).toBeInTheDocument()

      rerender(<Badge size="sm">Test</Badge>)
      rerender(<Badge size="lg">Test</Badge>)
    })
  })

  describe('Tag', () => {
    it('accepts variant prop with all valid values', () => {
      const { rerender } = render(<Tag variant="default">Test</Tag>)
      expect(screen.getByText('Test')).toBeInTheDocument()

      rerender(<Tag variant="primary">Test</Tag>)
      rerender(<Tag variant="secondary">Test</Tag>)
      rerender(<Tag variant="outline">Test</Tag>)
    })

    it('accepts size prop with all valid values', () => {
      const { rerender } = render(<Tag size="default">Test</Tag>)
      expect(screen.getByText('Test')).toBeInTheDocument()

      rerender(<Tag size="sm">Test</Tag>)
      rerender(<Tag size="lg">Test</Tag>)
    })
  })

  describe('Table', () => {
    it('accepts size prop with all valid values', () => {
      const { rerender } = render(
        <Table size="sm">
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(screen.getByRole('table')).toBeInTheDocument()

      rerender(
        <Table size="md">
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

      rerender(
        <Table size="lg">
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    })
  })

  describe('Switch', () => {
    it('accepts size prop with all valid values', () => {
      const { rerender } = render(<Switch size="default" />)
      expect(screen.getByRole('switch')).toBeInTheDocument()

      rerender(<Switch size="sm" />)
      rerender(<Switch size="lg" />)
    })
  })

  describe('Input', () => {
    it('accepts state prop with all valid values', () => {
      const { rerender } = render(<Input state="default" data-testid="input" />)
      expect(screen.getByTestId('input')).toBeInTheDocument()

      rerender(<Input state="error" data-testid="input" />)
    })
  })

  describe('TextField', () => {
    it('accepts state prop with all valid values', () => {
      const { rerender } = render(<TextField state="default" label="Test" />)
      expect(screen.getByLabelText('Test')).toBeInTheDocument()

      rerender(<TextField state="error" label="Test" />)
    })
  })

  describe('Select', () => {
    it('accepts state prop with all valid values', () => {
      const { rerender } = render(
        <Select>
          <SelectTrigger state="default" data-testid="trigger">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      expect(screen.getByTestId('trigger')).toBeInTheDocument()

      rerender(
        <Select>
          <SelectTrigger state="error" data-testid="trigger">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
    })
  })

  describe('MultiSelect', () => {
    it('accepts state prop with all valid values', () => {
      const options = [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
      ]

      const { rerender } = render(
        <MultiSelect
          options={options}
          state="default"
          placeholder="Select"
        />
      )
      expect(screen.getByRole('combobox')).toBeInTheDocument()

      rerender(
        <MultiSelect
          options={options}
          state="error"
          placeholder="Select"
        />
      )
    })
  })

  describe('Checkbox', () => {
    it('accepts size prop with all valid values', () => {
      const { rerender } = render(<Checkbox size="default" />)
      expect(screen.getByRole('checkbox')).toBeInTheDocument()

      rerender(<Checkbox size="sm" />)
      rerender(<Checkbox size="lg" />)
    })
  })

  describe('Accordion', () => {
    it('accepts variant prop with all valid values', () => {
      const { rerender } = render(
        <Accordion type="single" variant="default" collapsible>
          <AccordionItem value="1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      expect(screen.getByText('Trigger')).toBeInTheDocument()

      rerender(
        <Accordion type="single" variant="bordered" collapsible>
          <AccordionItem value="1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    })
  })

  describe('PageHeader', () => {
    it('compiles without variant prop (no variants defined)', () => {
      // PageHeader has empty variants: {} so it should NOT accept variant prop
      // This test verifies it works without variant
      render(<PageHeader title="Test Page" />)
      expect(screen.getByRole('heading', { name: 'Test Page' })).toBeInTheDocument()
    })

    it('accepts all defined props', () => {
      render(
        <PageHeader
          title="Test Page"
          description="Test description"
          icon={<span data-testid="icon">Icon</span>}
          actions={<button>Action</button>}
        />
      )
      expect(screen.getByRole('heading', { name: 'Test Page' })).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      // Actions render twice (desktop + mobile) with CSS visibility
      expect(screen.getAllByRole('button', { name: 'Action' })).toHaveLength(2)
    })
  })
})
