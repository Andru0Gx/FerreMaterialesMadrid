"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, ArrowUpDown, Search } from "lucide-react"
import { BankAccountForm } from "@/components/admin/bank-account-form"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface BankAccount {
    id: string
    type: "PAGO_MOVIL" | "TRANSFERENCIA"
    bank: string
    accountNumber?: string
    phone?: string
    document: string
    accountHolder: string
}

export default function BankAccountsPage() {
    const { user, isSuperAdmin } = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const [accounts, setAccounts] = useState<BankAccount[]>([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingAccount, setEditingAccount] = useState<BankAccount | undefined>(undefined)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    useEffect(() => {
        if (!user) {
            router.push("/login")
            return
        }

        if (!isSuperAdmin) {
            router.push("/admin")
            return
        }

        fetchAccounts()
    }, [user, isSuperAdmin, router])

    const fetchAccounts = async () => {
        try {
            const response = await fetch("/api/bank-accounts")

            if (!response.ok) {
                throw new Error("Error al obtener las cuentas bancarias")
            }

            const data = await response.json()
            setAccounts(data)
        } catch (error) {
            console.error("Error:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al obtener las cuentas bancarias",
            })
        }
    }

    const handleSubmit = async (data: any) => {
        try {
            const method = editingAccount ? "PUT" : "POST"
            const url = editingAccount
                ? `/api/bank-accounts/${editingAccount.id}`
                : "/api/bank-accounts"

            // Convertir el tipo a minúsculas antes de enviar
            const formattedData = {
                ...data,
                type: data.type.toLowerCase()
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || (editingAccount
                    ? "Error al actualizar la cuenta bancaria"
                    : "Error al crear la cuenta bancaria"
                ))
            }

            await fetchAccounts()
            setIsFormOpen(false)
            setEditingAccount(undefined)
            toast({
                title: "Éxito",
                description: editingAccount
                    ? "Cuenta bancaria actualizada correctamente"
                    : "Cuenta bancaria creada correctamente",
            })
        } catch (error) {
            console.error("Error:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Error desconocido",
            })
        }
    }

    const handleEdit = (account: BankAccount) => {
        setEditingAccount(account)
        setIsFormOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/bank-accounts/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Error al eliminar la cuenta bancaria")
            }

            await fetchAccounts()
            toast({
                title: "Éxito",
                description: "Cuenta bancaria eliminada correctamente",
            })
        } catch (error) {
            console.error("Error:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al eliminar la cuenta bancaria",
            })
        }
    }

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const filteredAndSortedAccounts = accounts
        .filter(account => {
            const searchLower = searchTerm.toLowerCase()
            return (
                account.accountHolder.toLowerCase().includes(searchLower) ||
                account.document.toLowerCase().includes(searchLower) ||
                account.bank.toLowerCase().includes(searchLower)
            )
        })
        .sort((a, b) => {
            if (!sortColumn) return 0

            let valueA, valueB
            switch (sortColumn) {
                case "type":
                    valueA = a.type
                    valueB = b.type
                    break
                case "bank":
                    valueA = a.bank
                    valueB = b.bank
                    break
                case "accountHolder":
                    valueA = a.accountHolder
                    valueB = b.accountHolder
                    break
                case "document":
                    valueA = a.document
                    valueB = b.document
                    break
                default:
                    return 0
            }

            if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
            if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
            return 0
        })

    const handleCancel = () => {
        setIsFormOpen(false)
        setEditingAccount(undefined)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Datos Bancarios</h1>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Cuenta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editingAccount ? "Editar Cuenta Bancaria" : "Agregar Cuenta Bancaria"}
                            </DialogTitle>
                            <DialogDescription>
                                Complete el formulario para {editingAccount ? "actualizar" : "agregar"} una cuenta bancaria.
                            </DialogDescription>
                        </DialogHeader>
                        <BankAccountForm
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            initialData={editingAccount}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Buscar cuentas..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead onClick={() => handleSort("type")} className="cursor-pointer">
                                Tipo <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                            </TableHead>
                            <TableHead onClick={() => handleSort("bank")} className="cursor-pointer">
                                Banco <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                            </TableHead>
                            <TableHead onClick={() => handleSort("accountHolder")} className="cursor-pointer">
                                Titular <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                            </TableHead>
                            <TableHead onClick={() => handleSort("document")} className="cursor-pointer">
                                Documento <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                            </TableHead>
                            <TableHead>Detalles</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedAccounts.map((account) => (
                            <TableRow key={account.id}>
                                <TableCell>
                                    {account.type === "PAGO_MOVIL" ? "Pago Móvil" : "Transferencia"}
                                </TableCell>
                                <TableCell>{account.bank}</TableCell>
                                <TableCell>{account.accountHolder}</TableCell>
                                <TableCell>{account.document}</TableCell>
                                <TableCell>
                                    {account.type === "PAGO_MOVIL" ? (
                                        <span>Teléfono: {account.phone}</span>
                                    ) : (
                                        <span>Cuenta: {account.accountNumber}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleEdit(account)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(account.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
} 