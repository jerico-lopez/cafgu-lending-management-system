import React from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const authBg = "/lovable-uploads/f79c8a91-7753-4751-8606-1624c268d377.png";
const bayanLogo = "/lovable-uploads/c220bffd-33c5-49db-b365-5c1a2681bdc8.png";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/");
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Background Image */}
            <div
                className="hidden lg:flex lg:w-1/2 bg-contain bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url(${authBg})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/60" />
                <div className="relative z-10 flex flex-col justify-center p-12 text-white">
                    <h1 className="text-4xl font-bold mb-4">Lending System</h1>
                    <p className="text-xl opacity-90 mb-6">
                        Secure financial management system
                    </p>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md">
                    {/* Logo/Title */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <img
                                src={bayanLogo}
                                alt="Bayan ng Tungawan Logo"
                                className="h-20 w-20 object-contain"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-primary mb-2">
                            Bayang Tungawan
                        </h2>
                    </div>

                    <Card className="border-border/50 shadow-[var(--shadow-soft)]">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">
                                Welcome Back
                            </CardTitle>
                            <CardDescription>
                                Sign in to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={data.username}
                                        onChange={(e) =>
                                            setData("username", e.target.value)
                                        }
                                        required
                                        placeholder="Enter your username"
                                    />
                                    {errors.username && (
                                        <div className="text-red-500 text-sm">
                                            {errors.username}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        required
                                        placeholder="Enter your password"
                                    />
                                    {errors.password && (
                                        <div className="text-red-500 text-sm">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
