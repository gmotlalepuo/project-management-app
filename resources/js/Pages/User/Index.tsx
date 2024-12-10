import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { PaginatedUser, User } from "@/types/user";
import { DataTable, ColumnDef } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { FilterableColumn, PaginationLinks, PaginationMeta } from "@/types/utils";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { CirclePlus } from "lucide-react";
import { formatDate } from "@/utils/helpers";

type IndexProps = {
  users: PaginatedUser & { meta: PaginationMeta; links: PaginationLinks };
  queryParams: { [key: string]: any } | null;
  success: string | null;
};

export default function Index({ users, queryParams, success }: IndexProps) {
  queryParams = queryParams || {};
  const { toast } = useToast();

  useEffect(() => {
    if (success) {
      toast({
        title: "Success",
        description: success,
        variant: "success",
      });
    }
  }, [success]);

  const columns = useMemo<ColumnDef<User, any>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) =>
          row.original.created_at ? formatDate(row.original.created_at) : "No date",
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DataTableRowActions
            row={row}
            onEdit={(row) => router.get(route("user.edit", row.original.id))}
            onDelete={(row) => {
              router.delete(route("user.destroy", row.original.id));
            }}
          />
        ),
      },
    ],
    [],
  );

  const filterableColumns: FilterableColumn[] = [
    {
      accessorKey: "name",
      title: "Name",
      filterType: "text",
    },
    {
      accessorKey: "email",
      title: "Email",
      filterType: "text",
    },
    {
      accessorKey: "created_at",
      title: "Created At",
      filterType: "date",
    },
  ];

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Users
          </h2>
        </div>
      }
    >
      <Head title="Users" />
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
              <h4>
                Create and manage user accounts, control access, and maintain user
                information.
              </h4>
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                <Link href={route("user.create")}>
                  <Button className="w-full sm:w-auto">
                    <CirclePlus className="h-5 w-5" />
                    <span>Create User</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <div className="mt-8 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <DataTable
                columns={columns}
                entity={users}
                filterableColumns={filterableColumns}
                queryParams={queryParams}
                routeName="user.index"
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
