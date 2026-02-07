
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { type User } from "@/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2, UserPlus, Edit } from "lucide-react";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { DeleteConfirmDialog } from "@/components/users/DeleteConfirmDialog";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    // Dialog States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // User Selection State
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    // Loading State
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (token) fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/users`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setUserToEdit(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setUserToEdit(user);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (_: React.FormEvent, data: any) => {
        setSubmitting(true);
        try {
            const url = userToEdit
                ? `${API_URL}/users/${userToEdit.id}`
                : `${API_URL}/users`;

            const method = userToEdit ? "PATCH" : "POST";

            // Prepare payload
            const payload: any = {
                name: data.name,
                role: data.role
            };

            if (!userToEdit) {
                payload.email = data.email;
                payload.password = data.password;
            } else if (data.resetPasswordMode) {
                payload.password = data.password;
            }

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`Failed to ${userToEdit ? 'update' : 'create'} user`);

            toast.success(`User ${userToEdit ? 'updated' : 'created'} successfully`);
            setIsFormOpen(false);
            fetchUsers();
        } catch (err) {
            toast.error(`Failed to ${userToEdit ? 'update' : 'create'} user`);
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = (id: string) => {
        setUserToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            const res = await fetch(`${API_URL}/users/${userToDelete}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to delete user");
            toast.success("User deleted");
            fetchUsers();
        } catch (err) {
            toast.error("Failed to delete user");
        } finally {
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage user access and roles.</p>
                </div>

                <Button onClick={handleOpenCreate}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            <UserFormDialog
                isOpen={isFormOpen}
                onClose={setIsFormOpen}
                onSubmit={handleFormSubmit}
                userToEdit={userToEdit}
                isSubmitting={submitting}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={setIsDeleteDialogOpen}
                onConfirm={handleDeleteUser}
                description="Are you sure you want to delete this user? This action cannot be undone."
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Loading users...</TableCell>
                            </TableRow>
                        ) : users.map((u) => (
                            <TableRow key={u.id}>
                                <TableCell className="font-medium">{u.name || "N/A"}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>{u.role}</TableCell>
                                <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(u)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => confirmDelete(u.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
