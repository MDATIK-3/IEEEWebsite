export function isActiveLink(pathname, href) {
  if (!pathname || !href) return false;

  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(href + '/');
}
