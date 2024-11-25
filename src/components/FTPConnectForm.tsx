import { FieldValues, Path, useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import React from "react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FtpConfig } from "@/helpers/ipc/ftp/lib/FtpConfig";
import { connectToFtpServer, disconnectFromFtpServer } from "@/helpers/ftp_helpers";
import { toast } from "sonner";

const ftpConfigSchema = z.object({
    host: z.string().ip({ version: "v4" }),
    port: z.number({ coerce: true, message: "Requires number" }).int(),
    user: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),
});

interface FTPConnectFormProps {
  setConnInfo: (connInfo: Omit<FtpConfig, "password">) => void;
  connInfo: Omit<FtpConfig, "password">;
}

export function FTPConnectForm(
    { setConnInfo, connInfo }: FTPConnectFormProps
) {
    const form = useForm<FtpConfig>({
        resolver: zodResolver(ftpConfigSchema),
        defaultValues: {
            host: "",
            port: 21,
            user: "",
            password: "",
        },
    });
    const [loading, setLoading] = React.useState(false);


    const onSubmit = async (data: FtpConfig) => {
        setLoading(true);
        const res = await connectToFtpServer(data);
        if (res) {
            toast.success("Connected to server");
            setConnInfo({
                ...data
            });

        } else {
            toast.error("Failed to connect to server");
        }
        setLoading(false);
    };

    const disconnect = () => {
        disconnectFromFtpServer();
        toast.success("Disconnected from server");
        setConnInfo({
            host: "",
            port: 21,
            user: "",
        });

    };

    return (
        <div className="flex gap-4 items-end">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-row items-end justify-center gap-4"
                >
                    <FormTextInput
                        label="Server IP"
                        name="host"
                        placeholder="Server IP"
                        form={form}
                    />
                    <FormTextInput
                        label="Port"
                        name="port"
                        placeholder="Port"
                        form={form}
                        type="number"
                    />
                    <FormTextInput
                        label="Username"
                        name="user"
                        placeholder="Username"
                        form={form}
                    />
                    <FormTextInput
                        label="Password"
                        name="password"
                        placeholder="Password"
                        form={form}
                        type="password"
                    />
                    {
                    !connInfo.host &&
                        
                    <Button type="submit"
                      disabled={loading}
                      className="w-32"
                    >
                        {loading ? <LoaderCircle size={24} className="animate-spin" /> : "Connect"}
                    </Button>
                    


                    }
                </form>
                {
                    connInfo.host &&
                    <Button
                        onClick={disconnect}
                        className="w-32"
                        variant={"destructive"}
                    >
                        Disconnect
                    </Button>
                }
            </Form>
        </div>
    );
}

type FormTextInputProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    placeholder: string;
    form: UseFormReturn<T, any, undefined>;
    description?: string;
    type?: "text" | "password" | "number";
};

export function FormTextInput<T extends FieldValues>({
    label,
    name,
    placeholder,
    form,
    description,
    type = "text",
}: FormTextInputProps<T>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <div className="flex items-center justify-between gap-2">
                        <FormLabel>{label}</FormLabel>
                        <FormMessage className="font-bold" />
                    </div>
                    <FormControl>
                        <Input placeholder={placeholder} {...field} type={type} />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                </FormItem>
            )}
        />
    );
}
