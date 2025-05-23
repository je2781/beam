export interface PaginationProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  hasPreviousPage: boolean,
  currentPage: number,
  hasNextPage: boolean,
  lastPage: number,
  nextPage: number,
  previousPage: number,
  isActivePage: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  setVisibleTrans: React.Dispatch<React.SetStateAction<any[]>>;
  trans: any[];
  setDividerPositions: React.Dispatch<React.SetStateAction<any[]>>;
}

export interface TransferModalProps {
  onClose: () => void;
  styleClasses?: string;
  children: React.ReactNode;
}

export interface TransferModalOverlayProps {
  onClick: () => void;
  styleClasses?: string;
  children: React.ReactNode;
  
}

export interface AddFundsModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export interface AddFundsModalOverlayProps {
  onClick: () => void;
  children: React.ReactNode;
}

export interface MobileModalProps {
  onClose: () => void;
  classes?: string;
  children: React.ReactNode;
}

export interface MobileModalOverlayProps {
  onClick: () => void;
  classes?: string;
  children: React.ReactNode;
}

export interface BackDropProps {
  onClick: () => void;
}
