"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";

const bankAccountSchema = z.object({
    type: z.enum(["PAGO_MOVIL", "TRANSFERENCIA"]),
    bank: z.string().min(1, "El banco es requerido"),
    accountNumber: z.string().optional(),
    phone: z.string().optional(),
    document: z.string().min(1, "El documento es requerido"),
    accountHolder: z.string().min(1, "El titular es requerido"),
});

type BankAccountFormValues = z.infer<typeof bankAccountSchema>;

interface BankAccount {
    id?: string;
    type: "PAGO_MOVIL" | "TRANSFERENCIA";
    bank: string;
    accountNumber?: string;
    phone?: string;
    document: string;
    accountHolder: string;
}

interface BankAccountFormProps {
    onSubmit: (data: BankAccount) => void;
    onCancel: () => void;
    initialData?: BankAccount;
}

export function BankAccountForm({
    onSubmit,
    onCancel,
    initialData,
}: BankAccountFormProps) {
    const form = useForm<BankAccountFormValues>({
        resolver: zodResolver(bankAccountSchema),
        defaultValues: initialData || {
            type: "PAGO_MOVIL",
            bank: "",
            accountNumber: "",
            phone: "",
            document: "",
            accountHolder: "",
        },
    });

    // Reset form values when initialData changes (for editing)
    useEffect(() => {
        if (initialData) {
            form.reset({
                type: initialData.type,
                bank: initialData.bank,
                accountNumber: initialData.accountNumber || "",
                phone: initialData.phone || "",
                document: initialData.document,
                accountHolder: initialData.accountHolder,
            });
        }
    }, [initialData, form]);

    const handleSubmit = (values: BankAccountFormValues) => {
        onSubmit({
            id: initialData?.id,
            ...values,
            accountNumber:
                values.type === "TRANSFERENCIA"
                    ? values.accountNumber
                    : undefined,
            phone: values.type === "PAGO_MOVIL" ? values.phone : undefined,
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de cuenta</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione el tipo de cuenta" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="PAGO_MOVIL">
                                        Pago Móvil
                                    </SelectItem>
                                    <SelectItem value="TRANSFERENCIA">
                                        Transferencia
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bank"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Banco</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione el banco" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="0172">
                                        0172 - BANCAMIGA
                                    </SelectItem>
                                    <SelectItem value="0102">
                                        0102 - BANCO DE VENEZUELA
                                    </SelectItem>
                                    <SelectItem value="0104">
                                        0104 - BANCO VENEZOLANO DE CRÉDITO
                                    </SelectItem>
                                    <SelectItem value="0105">
                                        0105 - BANCO MERCANTIL
                                    </SelectItem>
                                    <SelectItem value="0108">
                                        0108 - BANCO PROVINCIAL
                                    </SelectItem>
                                    <SelectItem value="0114">
                                        0114 - BANCO DEL CARIBE
                                    </SelectItem>
                                    <SelectItem value="0115">
                                        0115 - BANCO EXTERIOR
                                    </SelectItem>
                                    <SelectItem value="0128">
                                        0128 - BANCO CARONÍ
                                    </SelectItem>
                                    <SelectItem value="0134">
                                        0134 - BANESCO
                                    </SelectItem>
                                    <SelectItem value="0137">
                                        0137 - BANCO SOFITASA
                                    </SelectItem>
                                    <SelectItem value="0138">
                                        0138 - BANCO PLAZA
                                    </SelectItem>
                                    <SelectItem value="0146">
                                        0146 - BANGENTE
                                    </SelectItem>
                                    <SelectItem value="0151">
                                        0151 - BFC BANCO FONDO COMÚN
                                    </SelectItem>
                                    <SelectItem value="0156">
                                        0156 - 100% BANCO
                                    </SelectItem>
                                    <SelectItem value="0157">
                                        0157 - DELSUR BANCO
                                    </SelectItem>
                                    <SelectItem value="0163">
                                        0163 - BANCO DEL TESORO
                                    </SelectItem>
                                    <SelectItem value="0168">
                                        0168 - BANCRECER
                                    </SelectItem>
                                    <SelectItem value="0169">
                                        0169 - MIBANCO
                                    </SelectItem>
                                    <SelectItem value="0171">
                                        0171 - BANCO ACTIVO
                                    </SelectItem>
                                    <SelectItem value="0174">
                                        0174 - BANPLUS
                                    </SelectItem>
                                    <SelectItem value="0175">
                                        0175 - BANCO BICENTENARIO
                                    </SelectItem>
                                    <SelectItem value="0177">
                                        0177 - BANFANB
                                    </SelectItem>
                                    <SelectItem value="0191">
                                        0191 - BANCO NACIONAL DE CRÉDITO
                                    </SelectItem>
                                    <SelectItem value="0601">
                                        0601 - INSTITUTO MUNICIPAL DE CRÉDITO
                                        POPULAR
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="accountHolder"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titular de la cuenta</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Nombre del titular"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {form.watch("type") === "PAGO_MOVIL"
                                    ? "Cédula/RIF"
                                    : "Cédula/RIF"}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={
                                        form.watch("type") === "PAGO_MOVIL"
                                            ? "V-12345678"
                                            : "J-12345678-9"
                                    }
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {form.watch("type") === "TRANSFERENCIA" && (
                    <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de cuenta</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="01XX-XXXX-XXXX-XXXX-XXXX"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {form.watch("type") === "PAGO_MOVIL" && (
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="04XX-XXX-XXXX"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        {initialData ? "Actualizar" : "Guardar"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
