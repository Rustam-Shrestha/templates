"use client";

import { useCallback, useState } from "react";

export function useModal(initial = false) {
  const [isOpen, setIsOpen] = useState<boolean>(initial);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen((value: boolean) => !value), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
}

export default useModal;

