import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableSkeleton,
  TableEmpty,
  TableAvatar,
} from '../table'

describe('Table', () => {
  it('renders a basic table structure', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Item 1</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders with border by default', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const wrapper = screen.getByRole('table').parentElement
    expect(wrapper).toHaveClass('border')
    expect(wrapper).toHaveClass('border-[#E5E7EB]')
  })

  it('renders without border when withoutBorder is true', () => {
    render(
      <Table withoutBorder>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const wrapper = screen.getByRole('table').parentElement
    expect(wrapper).not.toHaveClass('border')
  })

  it.each([
    ['sm', '[&_td]:py-2'],
    ['md', '[&_td]:py-3'],
    ['lg', '[&_td]:py-4'],
  ] as const)('renders %s size variant', (size, expectedClass) => {
    render(
      <Table size={size}>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole('table')).toHaveClass(expectedClass)
  })

  it('applies custom className to Table', () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole('table')).toHaveClass('custom-table')
  })
})

describe('TableHeader', () => {
  it('renders with correct background', () => {
    render(
      <Table>
        <TableHeader data-testid="header">
          <TableRow>
            <TableHead>Title</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )

    expect(screen.getByTestId('header')).toHaveClass('bg-[#F9FAFB]')
  })
})

describe('TableRow', () => {
  it('renders with border by default', () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row">
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByTestId('row')).toHaveClass('border-b')
  })

  it('renders highlighted row', () => {
    render(
      <Table>
        <TableBody>
          <TableRow highlighted data-testid="row">
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByTestId('row')).toHaveClass('bg-[#EBF5FF]')
  })

  it('renders non-highlighted row with hover styles', () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row">
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByTestId('row')).toHaveClass('hover:bg-[#F9FAFB]/50')
  })
})

describe('TableHead', () => {
  it('renders column header', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Column Title</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )

    expect(screen.getByRole('columnheader')).toHaveTextContent('Column Title')
  })

  it('renders sticky column', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sticky data-testid="head">Sticky Column</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )

    expect(screen.getByTestId('head')).toHaveClass('sticky')
    expect(screen.getByTestId('head')).toHaveClass('left-0')
  })

  it('renders sort indicator for ascending', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="asc">Sortable</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )

    expect(screen.getByText('↑')).toBeInTheDocument()
  })

  it('renders sort indicator for descending', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="desc">Sortable</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )

    expect(screen.getByText('↓')).toBeInTheDocument()
  })

  it('renders info tooltip', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead infoTooltip="Help text">With Info</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )

    const infoIcon = screen.getByTitle('Help text')
    expect(infoIcon).toBeInTheDocument()
  })

  it('applies cursor-pointer when sortable', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="asc" data-testid="head">Sortable</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )

    expect(screen.getByTestId('head')).toHaveClass('cursor-pointer')
  })
})

describe('TableCell', () => {
  it('renders cell content', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole('cell')).toHaveTextContent('Cell Content')
  })

  it('renders sticky cell', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell sticky data-testid="cell">Sticky Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByTestId('cell')).toHaveClass('sticky')
    expect(screen.getByTestId('cell')).toHaveClass('left-0')
  })
})

describe('TableFooter', () => {
  it('renders footer with correct styles', () => {
    render(
      <Table>
        <TableFooter data-testid="footer">
          <TableRow>
            <TableCell>Footer Content</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    expect(screen.getByTestId('footer')).toHaveClass('border-t')
    expect(screen.getByTestId('footer')).toHaveClass('bg-[#F9FAFB]')
  })
})

describe('TableCaption', () => {
  it('renders caption', () => {
    render(
      <Table>
        <TableCaption>Table description</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByText('Table description')).toBeInTheDocument()
  })
})

describe('TableSkeleton', () => {
  it('renders default 5 rows and 5 columns', () => {
    render(
      <Table>
        <TableBody>
          <TableSkeleton />
        </TableBody>
      </Table>
    )

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(5)

    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(25) // 5 rows * 5 columns
  })

  it('renders custom number of rows and columns', () => {
    render(
      <Table>
        <TableBody>
          <TableSkeleton rows={3} columns={2} />
        </TableBody>
      </Table>
    )

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(3)

    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(6) // 3 rows * 2 columns
  })

  it('renders animated skeleton elements', () => {
    render(
      <Table>
        <TableBody>
          <TableSkeleton rows={1} columns={1} />
        </TableBody>
      </Table>
    )

    const skeletonDiv = screen.getByRole('cell').querySelector('div')
    expect(skeletonDiv).toHaveClass('animate-pulse')
  })
})

describe('TableEmpty', () => {
  it('renders default empty message', () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={3} />
        </TableBody>
      </Table>
    )

    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('renders custom empty message', () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={3}>Custom empty message</TableEmpty>
        </TableBody>
      </Table>
    )

    expect(screen.getByText('Custom empty message')).toBeInTheDocument()
  })

  it('spans correct number of columns', () => {
    render(
      <Table>
        <TableBody>
          <TableEmpty colSpan={5} />
        </TableBody>
      </Table>
    )

    expect(screen.getByRole('cell')).toHaveAttribute('colspan', '5')
  })
})

describe('TableAvatar', () => {
  it('renders initials', () => {
    render(<TableAvatar initials="JD" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('uses default color when not specified', () => {
    render(<TableAvatar initials="AB" />)
    const avatar = screen.getByText('AB')
    expect(avatar).toHaveStyle({ backgroundColor: '#7C3AED' })
  })

  it('uses custom color when specified', () => {
    render(<TableAvatar initials="XY" color="#FF0000" />)
    const avatar = screen.getByText('XY')
    expect(avatar).toHaveStyle({ backgroundColor: '#FF0000' })
  })

  it('has correct styling', () => {
    render(<TableAvatar initials="TS" />)
    const avatar = screen.getByText('TS')
    expect(avatar).toHaveClass('rounded-full')
    expect(avatar).toHaveClass('w-7')
    expect(avatar).toHaveClass('h-7')
  })
})

describe('Ref forwarding', () => {
  it('forwards ref to Table', () => {
    const ref = { current: null }
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(ref.current).toBeInstanceOf(HTMLTableElement)
  })

  it('forwards ref to TableRow', () => {
    const ref = { current: null }
    render(
      <Table>
        <TableBody>
          <TableRow ref={ref}>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(ref.current).toBeInstanceOf(HTMLTableRowElement)
  })

  it('forwards ref to TableCell', () => {
    const ref = { current: null }
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell ref={ref}>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement)
  })
})
