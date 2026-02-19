'use client'

import { authenticate } from '@/app/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  )

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Вход в систему</CardTitle>
          <CardDescription className="text-base">
            Введите свои данные для доступа к LMS
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Пароль</Label>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                required
                minLength={6}
                className="h-10"
              />
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm font-medium text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-md border border-red-200 dark:border-red-900">
                {errorMessage}
              </div>
            )}
          </CardContent>
          <CardFooter className="pb-8">
            <Button className="w-full h-10 text-base font-medium transition-all hover:bg-primary/90" type="submit" disabled={isPending}>
              {isPending ? 'Вход...' : 'Войти'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
