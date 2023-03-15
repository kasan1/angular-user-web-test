import {
  animation,
  style,
  animate,
  transition,
  stagger,
  query,
} from '@angular/animations';

export const slideXLeftInAnimation = animation([
  style({
    transform: 'translateX(-100%)',
    opacity: 0,
  }),
  animate(
    '.5s 0s ease-in',
    style({
      transform: 'translateX(0)',
      opacity: 1,
    })
  ),
]);

export const slideXLeftOutAnimation = animation([
  style({
    zIndex: 0,
  }),
  animate(
    '.5s 0s ease-out',
    style({
      transform: 'translateX(-100%)',
      opacity: 0,
    })
  ),
]);

export const slideXRightInAnimation = animation(
  [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate(
      '{{ delay }} 0s ease-in',
      style({
        transform: 'translateX(0)',
        opacity: 1,
      })
    ),
  ],
  {
    params: {
      delay: '.5s',
    },
  }
);

export const slideXRightOutAnimation = animation([
  animate(
    '.5s 0s ease-out',
    style({
      transform: 'translateX(100%)',
      opacity: 0,
    })
  ),
]);

export const slideYTopInAnimation = animation([
  style({
    transform: 'translateY(-100%)',
    opacity: 0,
  }),
  animate(
    '.5s 0s ease-in',
    style({
      transform: 'translateY(0)',
      opacity: 1,
    })
  ),
]);

export const slideYTopOutAnimation = animation([
  animate(
    '.5s 0s ease-out',
    style({
      transform: 'translateY(-100%)',
      opacity: 1,
    })
  ),
]);

export const slideYBottomInAnimation = animation([
  style({
    transform: 'translateY(100%)',
    opacity: 0,
  }),
  animate(
    '.5s 0s ease-in',
    style({
      transform: 'translateY(0)',
      opacity: 1,
    })
  ),
]);

export const slideYBottomOutAnimation = animation([
  animate(
    '.5s 0s ease-out',
    style({
      transform: 'translateY(100%)',
      opacity: 1,
    })
  ),
]);

export const fadeOutAnimation = animation([
  animate(
    '.5s 0s ease-out',
    style({
      opacity: 0,
    })
  ),
]);

export const fadeInAnimation = animation([
  style({ opacity: 0 }),
  animate(
    '.5s 0s ease-in',
    style({
      opacity: 1,
    })
  ),
]);

export function fadeIn(selector = ':enter', duration = '250ms ease-out') {
  return [
    transition('* => *', [
      query(
        selector,
        [
          style({ opacity: 0, transform: 'translateY(-5px)' }),
          stagger('60ms', [
            animate(
              duration,
              style({
                opacity: 1,
                transform: 'translateY(0px)',
              })
            ),
          ]),
        ],
        { optional: true }
      ),
    ]),
  ];
}

export function fadeOut(selector = ':leave', duration = 300) {
  return [
    transition('* => *', [
      query(
        selector,
        [
          style({ opacity: 1 }),
          stagger('30ms', [
            animate(
              duration,
              style({
                opacity: 0,
              })
            ),
          ]),
        ],
        { optional: true }
      ),
    ]),
  ];
}
