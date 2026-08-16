import React from "react";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock("@/lib/repositories/orderRepository", () => ({
  OrderRepository: {
    getAll: vi.fn(),
  },
}));

vi.mock("@/components/ui/OrderRow", () => ({
  default: ({
    order,
    onStatusChange,
    onCancelled,
  }: {
    order: {
      id: string;
      customer_name: string;
      status: string;
    };
    onStatusChange: (
      id: string,
      status: string,
    ) => void;
    onCancelled: (id: string) => void;
  }) => (
    <div data-testid={`order-${order.id}`}>
      <span>{order.customer_name}</span>
      <span>{order.status}</span>

      <button
        type="button"
        onClick={() =>
          onStatusChange(order.id, "delivered")
        }
      >
        Mark delivered {order.id}
      </button>

      <button
        type="button"
        onClick={() => onCancelled(order.id)}
      >
        Cancel {order.id}
      </button>
    </div>
  ),
}));

import { OrderRepository } from "@/lib/repositories/orderRepository";
import AdminOrdersPage from "@/app/admin/orders/page";

function makeOrder(
  id: string,
  customer: string,
  status: string,
) {
  return {
    id,
    customer_name: customer,
    customer_phone: "01700000000",
    delivery_address: "Dhaka",
    delivery_date: "2026-08-20",
    delivery_type: "standard",
    delivery_fee: 80,
    subtotal: 1000,
    discount_amount: 0,
    total_amount: 1080,
    status,
    special_notes: "",
    created_at: "2026-08-17T00:00:00Z",
    order_items: [],
  };
}

describe("AdminOrdersPage - unit tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and displays customer orders", async () => {
    vi.mocked(
      OrderRepository.getAll,
    ).mockResolvedValue({
      data: [
        makeOrder("o1", "Alice", "pending"),
        makeOrder("o2", "Bob", "delivered"),
      ],
      error: null,
    } as never);

    render(<AdminOrdersPage />);

    expect(
      await screen.findByText("Alice"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Bob"),
    ).toBeInTheDocument();
  });

  it("shows empty state when there are no orders", async () => {
    vi.mocked(
      OrderRepository.getAll,
    ).mockResolvedValue({
      data: [],
      error: null,
    } as never);

    render(<AdminOrdersPage />);

    expect(
      await screen.findByText(/no orders yet/i),
    ).toBeInTheDocument();
  });

  it("shows repository error when loading orders fails", async () => {
    vi.mocked(
      OrderRepository.getAll,
    ).mockResolvedValue({
      data: null,
      error: {
        message: "Database unavailable",
      },
    } as never);

    render(<AdminOrdersPage />);

    expect(
      await screen.findByText(
        /failed to load orders: database unavailable/i,
      ),
    ).toBeInTheDocument();
  });

  it("updates an order status locally", async () => {
    const user = userEvent.setup();

    vi.mocked(
      OrderRepository.getAll,
    ).mockResolvedValue({
      data: [
        makeOrder("o1", "Alice", "pending"),
      ],
      error: null,
    } as never);

    render(<AdminOrdersPage />);

    await screen.findByText("Alice");

    expect(
      screen.getByText("pending"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /mark delivered o1/i,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("delivered"),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText("pending"),
    ).not.toBeInTheDocument();
  });

  it("removes a cancelled order from the dashboard", async () => {
    const user = userEvent.setup();

    vi.mocked(
      OrderRepository.getAll,
    ).mockResolvedValue({
      data: [
        makeOrder("o1", "Alice", "pending"),
        makeOrder("o2", "Bob", "delivered"),
      ],
      error: null,
    } as never);

    render(<AdminOrdersPage />);

    await screen.findByText("Alice");

    await user.click(
      screen.getByRole("button", {
        name: /cancel o1/i,
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Alice"),
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByText("Bob"),
    ).toBeInTheDocument();
  });
});