// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';

// export const AuthGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const token = localStorage.getItem('Authorization');
  
//   if (token) {
//     return true;
//   } else {
//     router.navigate(['/login']);
//     return false;
//   }
// };
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('Authorization');
    const userRole = localStorage.getItem('loginAs');
    if (token) {
      const requiredRole = route.data?.['role'];
      const blockedRole = route.data?.['blockedRole'];
      
      if (blockedRole && userRole === blockedRole) {
        router.navigate(['/unauthorized']); // Redirect if the role is blocked
        return false;
      }
      if (requiredRole && userRole !== requiredRole) {
        router.navigate(['/dashboard']); // Redirect if role doesn't match
        return false;
      }
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  } else {
    // For server-side rendering, always return true or handle as needed
    return true;
  }
};

