import React, {useState} from "react";
import {ITrainer} from "../../types";
import {api} from "../../api";
import {CustomSelect} from "@vkontakte/vkui";

interface ITrainerOption {
  label: string,
  value: string,
}

interface TrainerSelectProps {
  trainer?: ITrainer
  onChange: (trainer: ITrainer) => void,
  status?: 'default' | 'valid' | 'error'
}

export const TrainerSelect: React.FC<TrainerSelectProps> = ({
  trainer,
  onChange,
  status='default'
}) => {
  const [trainers, setTrainers] = useState<ITrainer[]>([]);
  const [trainerOptions, setTrainerOptions] = useState<ITrainerOption[]>(trainer ? [
    {
      value: `${trainer.id}`,
      label: `${trainer.first_name} ${trainer.last_name}`
    }
  ]: [])
  const [trainersFetching, setTrainersFetching] = useState(false);

  const fetchTrainers = () => {
    if (!trainers.length) {
      setTrainersFetching(true);
      api.getTrainers().then(data => {
        setTrainersFetching(false);
        setTrainers(data);
        setTrainerOptions(data.map(item => ({
          label: `${item.first_name} ${item.last_name}`,
          value: `${item.id}`
        })));
      }).catch(e => {
        setTrainersFetching(false);
        console.log(e)
      })
    }
  }

  return (
    <CustomSelect
      aria-label={'Тренер'}
      value={trainer ? `${trainer.id}` : undefined}
      options={trainerOptions}
      onChange={e => onChange(
        trainers.filter(item => `${item.id}` === e.target.value)[0]
      )}
      status={status}
      searchable
      placeholder={'Введите имя тренера'}
      disabled={trainersFetching}
      fetching={trainersFetching}
      onOpen={fetchTrainers}
    />
  )
}