import { redirect } from 'next/navigation';

export default function ServerExampleRedirect() {
  // Redirect to the correct route in the examples group
  redirect('/(examples)/server-example');
}
