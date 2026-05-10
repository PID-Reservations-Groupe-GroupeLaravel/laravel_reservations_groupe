<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <title>{{ __('messages.artists.list') }}</title>
</head>
<body>

<h1>{{ __('messages.artists.list') }}</h1>

<a href="{{ route('artists.create') }}">{{ __('messages.artists.add') }}</a>

<table border="1" cellpadding="5">
    <tr>
        <th>ID</th>
        <th>{{ __('messages.artists.firstname') }}</th>
        <th>{{ __('messages.artists.lastname') }}</th>
        <th>{{ __('messages.artists.actions') }}</th>
    </tr>

    @foreach($artists as $artist)
    <tr>
        <td>{{ $artist->id }}</td>

        <td>
            <a href="{{ route('artists.show', $artist->id) }}">
                {{ $artist->firstname }}
            </a>
        </td>
        <td>
            <a href="{{ route('artists.show', $artist->id) }}">
                {{ $artist->lastname }}
            </a>
        </td>

        <td>
            <a href="{{ route('artists.edit', $artist->id) }}">{{ __('messages.artists.edit') }}</a>

            <form action="{{ route('artists.destroy', $artist->id) }}" method="POST" style="display:inline">
                @csrf
                @method('DELETE')
                <button type="submit" onclick="return confirm('{{ __('messages.artists.delete_confirm') }}')">
                    {{ __('messages.artists.delete') }}
                </button>
            </form>
        </td>
    </tr>
    @endforeach

</table>

</body>
</html>
