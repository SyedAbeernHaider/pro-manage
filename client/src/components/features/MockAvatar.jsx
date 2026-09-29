const MockAvatar = ({ person, className = 'size-6' }) => (
  <img
    src={person.avatar}
    alt={person.name}
    title={person.name}
    loading="lazy"
    className={`${className} shrink-0 rounded-full bg-white ring-2 ring-white`}
  />
);

export default MockAvatar;
