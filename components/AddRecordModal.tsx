"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { FuelRecord } from "@/lib/types";
import { formatMXN, todayISO } from "@/lib/calculations";
import { v4 as uuid } from "uuid";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: FuelRecord) => void;
}

export function AddRecordModal({ isOpen, onClose, onSave }: Props) {
  const [odometer, setOdometer] = useState("");
  const [liters, setLiters] = useState("");
  const [price, setPrice] = useState("");
  const [station, setStation] = useState("");
  const [date, setDate] = useState(todayISO());

  useEffect(() => {
    if (isOpen) {
      setOdometer("");
      setLiters("");
      setPrice("");
      setStation("");
      setDate(todayISO());
    }
  }, [isOpen]);

  const totalCost = useMemo(() => {
    const l = parseFloat(liters);
    const p = parseFloat(price);
    if (isNaN(l) || isNaN(p)) return 0;
    return l * p;
  }, [liters, price]);

  const odoNum = parseFloat(odometer);
  const litersNum = parseFloat(liters);
  const priceNum = parseFloat(price);
  const valid =
    !isNaN(odoNum) &&
    odoNum > 0 &&
    !isNaN(litersNum) &&
    litersNum > 0 &&
    !isNaN(priceNum) &&
    priceNum > 0 &&
    !!date;

  function handleSave() {
    if (!valid) return;
    const record: FuelRecord = {
      id: uuid(),
      date,
      odometer: odoNum,
      liters: litersNum,
      pricePerLiter: priceNum,
      totalCost: Number((litersNum * priceNum).toFixed(2)),
      kmDriven: null,
      efficiency: null,
      station: station.trim() || undefined,
    };
    onSave(record);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      scrollBehavior="inside"
      size="md"
      classNames={{
        wrapper: "!top-0 !left-0 !right-0 !bottom-0 !h-screen !inset-0 items-center",
        base: "sm:max-w-md mx-2 my-2 sm:m-4 rounded-3xl",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-2">
              <h2 className="text-xl font-bold">Nuevo llenado</h2>
              <p className="text-xs text-default-500 font-normal">
                Registra los datos de tu carga de gasolina
              </p>
            </ModalHeader>
            <ModalBody className="gap-4 pb-2">
              <Input
                type="number"
                inputMode="decimal"
                label="Lectura del odómetro"
                placeholder="0"
                value={odometer}
                onValueChange={setOdometer}
                endContent={<span className="text-default-400 text-sm">km</span>}
                isRequired
                size="lg"
                variant="bordered"
                classNames={{ input: "text-base" }}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  inputMode="decimal"
                  label="Litros"
                  placeholder="0.00"
                  value={liters}
                  onValueChange={setLiters}
                  endContent={<span className="text-default-400 text-sm">L</span>}
                  isRequired
                  size="lg"
                  variant="bordered"
                />
                <Input
                  type="number"
                  inputMode="decimal"
                  label="Precio/L"
                  placeholder="0.00"
                  value={price}
                  onValueChange={setPrice}
                  startContent={
                    <span className="text-default-400 text-sm">$</span>
                  }
                  isRequired
                  size="lg"
                  variant="bordered"
                />
              </div>

              <div className="rounded-2xl bg-primary-50 border border-primary-100 px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-primary-700 uppercase tracking-wider font-semibold">
                  Costo total
                </span>
                <span className="text-xl font-bold text-primary-700">
                  {formatMXN(totalCost)}
                </span>
              </div>

              <Input
                label="Gasolinera (opcional)"
                placeholder="Ej. Pemex Tabasco 2000"
                value={station}
                onValueChange={setStation}
                size="lg"
                variant="bordered"
              />
              <Input
                type="date"
                label="Fecha"
                value={date}
                onValueChange={setDate}
                size="lg"
                variant="bordered"
                isRequired
              />
            </ModalBody>
            <ModalFooter className="pt-3 pb-6 gap-2 flex-col-reverse sm:flex-row">
              <Button
                variant="flat"
                onPress={onClose}
                className="tap-target w-full sm:w-auto font-medium"
                size="lg"
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={handleSave}
                isDisabled={!valid}
                className="tap-target w-full sm:w-auto font-semibold"
                size="lg"
              >
                Guardar llenado
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
