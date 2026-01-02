'use client'
import React,{useEffect,useState} from 'react'
import {
  Table,TableHeader,TableColumn,TableBody,TableRow,
  TableCell,Input,Button,DropdownTrigger,
  Dropdown,DropdownMenu,DropdownItem,
  Pagination,Selection,ChipProps,SortDescriptor,
} from "@nextui-org/react";
import DeleteModal from './DeleteModal'
import ShowDetailsModal from './ShowDetailsModal'
import ShowCarPlace from './ShowCarPlace'
import UpdateModal from './UpdateModal'
import AddImeiDeviceModal from './AddImeiDeviceModal'
//Materialui icons 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import {capitalize} from "../utils/capitalize";
import { useSession } from "next-auth/react";

const INITIAL_VISIBLE_COLUMNS = ["imei", "car", "user","actions"];

type Device = typeof devices[0];


export default function MyDevicesTable() {
  //Call session 
  const { data: session, status } = useSession();
  //Columns of Devices Table
  const columns = [
  {name: "IMEI", uid: "imei", sortable: false},
  {name: "CAR", uid: "car", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];
//fetch devicess data
  const [devices, setDevices] = useState([])
  const userId = session?.user.id 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`../api/device/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          }
      })
        if (response.ok) {
          const data = await response.json()
          setDevices(data)
        } else {
          console.error('Failed to fetch devices data:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching devices data:', error)
      }
    }
    fetchData()
  }, [devices])

  // handle Deleted Devices
  const deleteDeviceFromTable = React.useCallback((id:string) => {
  const updateDevices = devices.filter(device => device.id !== id);
  setDevices(updateDevices); 
}, [devices]);


  
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({ direction: "ascending",});
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(devices.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredDevices = [...devices];

    if (hasSearchFilter) {
      filteredDevices = filteredDevices.filter((device) =>
        device.car.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredDevices = filteredDevices.filter((device) =>
    //     Array.from(statusFilter).includes(device.status),
    //   );
    // }

    return filteredDevices;
  }, [devices, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Device, b: Device) => {
      const first = a[sortDescriptor.column as keyof Device] as number;
      const second = b[sortDescriptor.column as keyof Device] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((device: Device, columnKey: React.Key) => {
    const cellValue = device[columnKey as keyof Device];

    switch (columnKey) {
      
      case "imei":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{device.imei}</p>
          </div>
        );
      case "car":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{device.car}</p>
          </div>
        );
    
      case "actions":
        return (
          <div className="relative flex justify-start items-center gap-2">
            {/* <UpdateModal device={device} /> */}
            <DeleteModal deviceId={device.imei} deleteDevice={deleteDeviceFromTable}/>
            <ShowDetailsModal/>
            <ShowCarPlace/>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1 border-blue-700",
            }}
            placeholder="Search by car name..."
            size="md"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            
            <Dropdown className="dark:bg-blue-800 text-blue-800 dark:text-gray-200">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ExpandMoreIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <AddImeiDeviceModal />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {devices.length} devices</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    devices.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  // table head styling
  
  const classNames = React.useMemo(
    () => ({
      wrapper: [" max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <Table 
      isCompact
      removeWrapper
      aria-label="table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      checkboxesProps={{
        classNames: {
          wrapper: "after:bg-foreground after:text-background text-background",
        },
      }}
      classNames={classNames}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No devices found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.imei}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

