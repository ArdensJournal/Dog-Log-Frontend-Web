'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const graphqlQuery = {
        query: `
          mutation SignUp($signUpByCredentialsDto: SignInOrSignUpByCredentialsDto!) {
            signUpByCredentials(signUpByCredentialsDto: $signUpByCredentialsDto) {
              accessToken
              refreshToken
            }
          }
        `,
        variables: {
          signUpByCredentialsDto: { email, name, password }
        }
      };

      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graphqlQuery),
      });

      const result = await res.json();
      console.log('Sign Up Result:', result);
      const data = result.data?.signUpByCredentials;
      if (res.ok && data?.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        router.push('/'); // Redirect to homepage
      } else {
        setError(result.errors?.[0]?.message || 'Sign up failed');
      }
    } catch (err) {
      setError('Sign up failed');
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">Create Your Dog Log Account</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required    
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="text-gray-700 text-sm">Show Password</label>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white font-bold py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
          {error && <div className="text-red-500 text-center">{error}</div>}
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/signin" className="text-indigo-500 underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}