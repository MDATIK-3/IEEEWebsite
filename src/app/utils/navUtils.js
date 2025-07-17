export function isActiveLink(pathname, href) {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(href + '/');
}
