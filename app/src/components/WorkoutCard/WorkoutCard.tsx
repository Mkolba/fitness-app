import React from "react";
import {Card, CardProps, Tappable} from "@vkontakte/vkui";
import {
  Icon16CancelCircle,
  Icon16Clock,
  Icon16DoneCircle,
  Icon24ChevronRightOutline
} from "@vkontakte/icons";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {IWorkout} from "../../types";
import './style.scss'

interface WorkoutCardProps extends CardProps {
  workout: IWorkout,
  showSalary?: boolean,
  showChevron?: boolean
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  showChevron=true,
  showSalary=false,
  ...restProps
}) => {
  const router = useRouteNavigator();

  return (
    <Card {...restProps} className={'WorkoutCard'}>
      <Tappable onClick={() => router.push('/workout/' + workout.id)} className={'WorkoutCard__Tappable'}>
        <div className={'WorkoutCard__Content'}>
          <div className={'WorkoutCard--header'}>
            {workout.client.last_name} {workout.client.first_name} {workout.client.surname}
          </div>
          <div className={'WorkoutCard--description'}>
            Тренер: {workout.trainer.first_name} {workout.trainer.last_name}<br/>
            {workout.workout_type.title} — {workout.workout_type.price}₽
            {showSalary && workout.status === 'done' ?
              <>
                <br/>Получено: {workout.workout_type.price / 2}₽
              </>
              :
              null
            }
          </div>
          <div className={'WorkoutCard--bottom'}>
            <div className={'WorkoutCard--date'}>
              {new Date(workout.date).toLocaleString()}
            </div>
            <div className={'WorkoutCard--state'}>
              {
                  workout.status === 'done' ?
                    <Icon16DoneCircle color={'var(--vkui--color_background_positive)'}/>
                  :
                  workout.status === 'cancelled' ?
                    <Icon16CancelCircle width={14} height={14} color={'var(--vkui--color_background_negative)'}/>
                  :
                  <Icon16Clock width={14} height={14} color={'#ffa918'}/>
              }
            </div>
          </div>
        </div>
        {showChevron &&
          <div className={'WorkoutCard__Chevron'}>
            <Icon24ChevronRightOutline color={'var(--vkui--color_background_accent_themed)'}/>
          </div>
        }
      </Tappable>
    </Card>
  )
}