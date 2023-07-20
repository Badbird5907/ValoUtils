plugins {
    id("java")
    id("io.freefair.lombok") version "8.1.0"
}

group = "dev.badbird"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.squareup.okhttp3:okhttp:5.0.0-alpha.11")
    implementation("com.google.code.gson:gson:2.10.1")
    implementation("com.formdev:flatlaf:3.1.1")
    implementation("com.formdev:flatlaf-intellij-themes:3.1.1")
    implementation("li.flor:native-j-file-chooser:1.6.4")

    testImplementation(platform("org.junit:junit-bom:5.9.1"))
    testImplementation("org.junit.jupiter:junit-jupiter")
}

tasks.test {
    useJUnitPlatform()
}

tasks.jar {
    from(configurations.compileClasspath.get().map { if (it.isDirectory()) it else zipTree(it) })
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    manifest {
        attributes["Main-Class"] = "dev.badbird.valoutils.Main"
    }
}

tasks.register("run", JavaExec::class) {
    classpath = sourceSets["main"].runtimeClasspath
    mainClass.set("dev.badbird.valoutils.Main")
}