import { ArrowTopRightIcon, CaretSortIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  StringOrTemplateHeader,
  Table,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useMemo, useState } from "react";
import ErrorAlert from "~/components/ErrorAlert";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Input, InputProps } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useFoodTrucks } from "~/services/food-trucks";
import { FoodTruck } from "~/typings/models";

const renderHeader = (
  header: React.ReactNode
): StringOrTemplateHeader<FoodTruck, unknown> => {
  return ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {header}
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    );
  };
};

const STATUSES = ["APPROVED", "REQUESTED", "EXPIRED", "ISSUED", "SUSPEND"].map(
  (s) => ({ label: s, value: s })
);

const columns: ColumnDef<FoodTruck>[] = [
  {
    accessorKey: "locationId",
    header: renderHeader("LocationId"),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell({ row }) {
      return (
        <a
          href={`https://www.google.com/maps?q=${row.original.latitude},${row.original.longitude}`}
          rel="noopener noreferrer"
          target="_blank"
          className="hover:text-primary"
        >
          {row.getValue("address")}
          <ArrowTopRightIcon className="inline" />
        </a>
      );
    },
  },
  {
    accessorKey: "zip",
    header: "Zip Codes",
  },
  {
    accessorKey: "foodItems",
    header: "Foods",
  },
  {
    accessorKey: "applicant",
    header: "Applicant",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

const FilterField = (props: { label: string; children: React.ReactNode }) => {
  const { label, children } = props;
  return (
    <div className="flex items-center gap-2">
      <label>{label}</label>
      {children}
    </div>
  );
};

const FilterInput = <T,>(
  props: { table: Table<T>; column: string } & InputProps
) => {
  const { table, column, ...rest } = props;
  return (
    <Input
      placeholder="Filter"
      {...rest}
      value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(column)?.setFilterValue(event.target.value)
      }
      className={clsx("max-w-[180px]", rest.className)}
    />
  );
};

const FilterSelect = <T,>(props: {
  table: Table<T>;
  column: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}) => {
  const { table, column, options, placeholder, className } = props;
  return (
    <Select
      value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
      onValueChange={(v) => table.getColumn(column)?.setFilterValue(v)}
    >
      <SelectTrigger className={clsx("w-[180px]", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default function FoodTrucks() {
  const { data: rawData, isPending, error, refetch } = useFoodTrucks();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const data = useMemo(() => {
    if (!rawData) return [];
    return rawData.slice().sort((a, b) => a.locationId - b.locationId);
  }, [rawData]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "locationId", desc: false },
  ]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const onResetFilters = () => {
    setColumnFilters([]);
  };

  return (
    <div className="container p-4 mx-auto">
      {isPending ? (
        <div className="flex justify-center">
          <LoadingSpinner data-testid="loading" />
        </div>
      ) : error ? (
        <ErrorAlert
          description={`Failed to fetch data, reason: ${error?.message}`}
          extra={
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : (
        <div>
          <DataTable
            columns={columns}
            data={data}
            defaultColumn={{
              size: 120,
              maxSize: 240,
              minSize: 50,
            }}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            onColumnFiltersChange={setColumnFilters}
            state={{
              pagination,
              sorting,
              columnFilters,
            }}
            renderFilters={(table) => (
              <div className="flex items-center gap-3 py-4">
                <FilterField label="Address">
                  <FilterInput
                    table={table}
                    column="address"
                    placeholder="Filter Address"
                  />
                </FilterField>
                <FilterField label="Foods">
                  <FilterInput
                    table={table}
                    column="foodItems"
                    placeholder="Filter Foods"
                  />
                </FilterField>
                <FilterField label="Status">
                  <FilterSelect
                    table={table}
                    column="status"
                    placeholder="Select Status"
                    options={STATUSES}
                  />
                </FilterField>
                <Button onClick={onResetFilters} variant="secondary">
                  Reset
                </Button>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}
