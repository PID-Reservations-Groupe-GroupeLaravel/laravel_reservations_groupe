<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <title>{{ __('messages.artists.title_edit') }}</title>
</head>
<body>

<h1>{{ __('messages.artists.title_edit') }}</h1>

<form action="{{ route('artists.update', $artist) }}" method="POST">
    @csrf
    @method('PUT')

    <label>{{ __('messages.artists.firstname') }}:</label><br>
    <input type="text" name="firstname" value="{{ $artist->firstname }}"><br><br>

    <label>{{ __('messages.artists.lastname') }}:</label><br>
    <input type="text" name="lastname" value="{{ $artist->lastname }}"><br><br>

    <button type="submit">{{ __('messages.artists.save') }}</button>
</form>

<br>
<a href="{{ route('artists.index') }}">{{ __('messages.artists.back') }}</a>

</body>
</html>
