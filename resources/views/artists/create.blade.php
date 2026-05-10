<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <title>{{ __('messages.artists.title_add') }}</title>
</head>
<body>

<h1>{{ __('messages.artists.title_add') }}</h1>

<form action="{{ route('artists.store') }}" method="POST">
    @csrf

    <label>{{ __('messages.artists.firstname') }}:</label><br>
    <input type="text" name="firstname"><br><br>

    <label>{{ __('messages.artists.lastname') }}:</label><br>
    <input type="text" name="lastname"><br><br>

    <button type="submit">{{ __('messages.artists.save') }}</button>
</form>

<br>
<a href="{{ route('artists.index') }}">{{ __('messages.artists.back') }}</a>

</body>
</html>
