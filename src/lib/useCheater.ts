type cheaterMode = 'transparent';

export default function useCheater() {
  function isCheaterModeActivate(mode: cheaterMode) {
    const urlSearch = new URLSearchParams(location.search);
    const cheaterOptions = urlSearch.get('cheater');
    if (cheaterOptions === null) return false;
    return cheaterOptions.split(',').includes(mode);
  }
  return { isCheaterModeActivate };
}

