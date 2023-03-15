import NCALayerFunctionality from '../util/ncaLayer';

describe('ncaLayer', () => {
  let ncaLayer: NCALayerFunctionality;

  beforeEach(() => {
    ncaLayer = new NCALayerFunctionality();
  });

  afterEach(() => {
    ncaLayer.ngOnDestroy();
  });

  it('should emit a false loading on close and error events', () => {
    const emissions = [];
    ncaLayer._loading$.subscribe((l) => emissions.push(l));

    ncaLayer._errors$.next(null);
    ncaLayer._closed$.next();

    expect(emissions.length).toBe(2);
    expect(emissions.every((e) => e === false)).toBe(true);
  });

  it('should STOP emitting loading values on public getter AFTER layer is closed', () => {
    const emissions = [];
    ncaLayer.loading$.subscribe((l) => emissions.push(l));

    ncaLayer._closed$.next();
    ncaLayer._errors$.next();
    ncaLayer._errors$.next();

    expect(emissions.length).toBe(1);
  });
});
