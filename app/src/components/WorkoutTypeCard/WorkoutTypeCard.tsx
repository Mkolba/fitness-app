import {Card, CardProps, Tappable} from "@vkontakte/vkui";
import React from "react";
import {IWorkoutType} from "../../types";
import './style.scss';
import {Icon24ChevronRightOutline} from "@vkontakte/icons";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

interface WorkoutTypeCardProps extends CardProps {
  workoutType: IWorkoutType,
  expandable?: boolean
}

export const WorkoutTypeCard: React.FC<WorkoutTypeCardProps> = ({
  workoutType,
  expandable=true,
  ...restProps
}) => {
  const router = useRouteNavigator();

  return (
    <Card {...restProps} className={'WorkoutTypeCard'}>
      <Tappable onClick={() => {
        if (expandable) {
          router.push('/workoutType/' + workoutType.id)
        }
      }} className={'WorkoutTypeCard__Tappable'}>
        <div className={'WorkoutTypeCard__Content'}>
          <div className={'WorkoutTypeCard--header'}>
            {workoutType.title}
          </div>
        </div>
        {expandable &&
          <div className={'WorkoutTypeCard__Chevron'}>
            <Icon24ChevronRightOutline color={'var(--vkui--color_background_accent_themed)'}/>
          </div>
        }
      </Tappable>
    </Card>
  )
}