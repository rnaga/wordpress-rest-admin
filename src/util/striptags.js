
export default html => {
    if(typeof html !== 'string')
        return '';

    return html.replace(/<[^>]+>/g, '');
}
