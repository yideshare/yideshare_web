export function getInitials(name: string): string {
    const parts = name.split(' ');
    let initials = '';
    
    if (parts.length > 0) initials += parts[0][0].toUpperCase();
    
    if (parts.length > 1) initials += parts[parts.length - 1][0].toUpperCase();
    
    return initials || '?'; // no name
  }