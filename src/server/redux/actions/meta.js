export const META_ONLINECOUNTSET = 'META_ONLINECOUNTSET';

export const actions = {
  onlinecountSet
};

export function onlinecountSet(count) {
  return {
    type: META_ONLINECOUNTSET,
    onlinecount: count,
    broadcast: true
  };
}
