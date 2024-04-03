import React, {useState} from "react";
import {IWorkoutType} from "../../types";
import {api} from "../../api";
import {CustomSelect} from "@vkontakte/vkui";

interface IWorkoutTypeOption {
  label: string,
  value: string,
}

interface WorkoutTypeSelectProps {
  workoutType?: IWorkoutType
  onChange: (workoutType: IWorkoutType) => void,
  status?: 'default' | 'error' | 'valid'
}

export const WorkoutTypeSelect: React.FC<WorkoutTypeSelectProps> = ({
  workoutType,
  onChange,
  status='default'
}) => {
  const [workoutTypes, setWorkoutTypes] = useState<IWorkoutType[]>([]);
  const [workoutTypeOptions, setWorkoutTypeOptions] = useState<IWorkoutTypeOption[]>(workoutType ? [
    {
      label: `${workoutType.title} — ${workoutType.price}₽`,
      value: `${workoutType.id}`
    }
  ] : [])
  const [workoutTypesFetching, setWorkoutTypesFetching] = useState(false);

  const fetchWorkoutTypes = () => {
    if (!workoutTypes.length) {
      setWorkoutTypesFetching(true);
      api.getWorkoutTypes().then(data => {
        setWorkoutTypesFetching(false);
        setWorkoutTypes(data);
        setWorkoutTypeOptions(data.map(item => ({
          label: `${item.title} — ${item.price}₽`,
          value: `${item.id}`
        })));
      }).catch(e => {
        setWorkoutTypesFetching(false);
        console.log(e)
      })
    }
  }

  return (
    <CustomSelect
      aria-label={'Тип тренировки'}
      value={workoutType ? `${workoutType.id}` : undefined}
      options={workoutTypeOptions}
      onChange={e => onChange(
        workoutTypes.filter(item => `${item.id}` === e.target.value)[0]
      )}
      status={status}
      searchable
      placeholder={'Введите наименование типа'}
      disabled={workoutTypesFetching}
      fetching={workoutTypesFetching}
      onOpen={fetchWorkoutTypes}
    />
  )
}